param(
  [Parameter(Mandatory=$true)][string]$Source,
  [string]$Destination = 'assets/course-images/astrodynamics-laws'
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $Source).Path)
try {
  $root = [IO.Path]::GetFullPath((Join-Path (Get-Location).Path $Destination))
  [IO.Directory]::CreateDirectory((Join-Path $root 'originals')) | Out-Null
  $images = @()
  foreach ($entry in $archive.Entries) {
    if ($entry.FullName -match '^ppt/media/([^/]+\.(png|jpe?g|gif|emf|wmf|wdp|svg))$') {
      $filename = $Matches[1]
      [IO.Compression.ZipFileExtensions]::ExtractToFile($entry, (Join-Path $root "originals/$filename"), $true)
      $images += [PSCustomObject]@{ filename = $filename; bytes = $entry.Length }
    }
  }
  $occurrences = @()
  $slideEntries = $archive.Entries | Where-Object FullName -Match '^ppt/slides/slide[0-9]+\.xml$' | Sort-Object { [int]($_.Name -replace '\D','') }
  foreach ($entry in $slideEntries) {
    $slideNumber = [int]($entry.Name -replace '\D','')
    $reader = [IO.StreamReader]::new($entry.Open())
    [xml]$slide = $reader.ReadToEnd()
    $reader.Dispose()
    $relationships = @{}
    $relEntry = $archive.GetEntry("ppt/slides/_rels/$($entry.Name).rels")
    if ($relEntry) {
      $reader = [IO.StreamReader]::new($relEntry.Open())
      [xml]$rels = $reader.ReadToEnd()
      $reader.Dispose()
      foreach ($rel in $rels.Relationships.Relationship) { $relationships[$rel.Id] = $rel }
    }
    foreach ($picture in $slide.SelectNodes('//*[local-name()="pic"]')) {
      $properties = $picture.SelectSingleNode('.//*[local-name()="cNvPr"]')
      $blip = $picture.SelectSingleNode('.//*[local-name()="blip"]')
      if (-not $blip) { continue }
      $id = $blip.GetAttribute('embed', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
      $rel = $relationships[$id]
      if (-not $rel -or $rel.TargetMode -eq 'External') { continue }
      $rect = $picture.SelectSingleNode('.//*[local-name()="srcRect"]')
      $xfrm = $picture.SelectSingleNode('.//*[local-name()="xfrm"]')
      $ext = $xfrm.SelectSingleNode('./*[local-name()="ext"]')
      $off = $xfrm.SelectSingleNode('./*[local-name()="off"]')
      $crop = @{}
      foreach ($side in @('l','t','r','b')) { $crop[$side] = if ($rect -and $rect.HasAttribute($side)) { [int]$rect.GetAttribute($side) } else { 0 } }
      $occurrences += [PSCustomObject]@{
        slide = $slideNumber; shapeId = $properties.GetAttribute('id'); name = $properties.GetAttribute('name'); description = $properties.GetAttribute('descr')
        filename = [IO.Path]::GetFileName($rel.Target); crop = $crop
        x = if ($off) { [long]$off.GetAttribute('x') } else { 0 }; y = if ($off) { [long]$off.GetAttribute('y') } else { 0 }
        width = if ($ext) { [long]$ext.GetAttribute('cx') } else { 0 }; height = if ($ext) { [long]$ext.GetAttribute('cy') } else { 0 }
        rotation = if ($xfrm.HasAttribute('rot')) { [int]$xfrm.GetAttribute('rot') } else { 0 }
        flipH = $xfrm.GetAttribute('flipH') -eq '1'; flipV = $xfrm.GetAttribute('flipV') -eq '1'
      }
    }
  }
  $references = @()
  foreach ($entry in ($archive.Entries | Where-Object FullName -Match '\.rels$')) {
    $reader = [IO.StreamReader]::new($entry.Open())
    [xml]$rels = $reader.ReadToEnd()
    $reader.Dispose()
    foreach ($rel in $rels.Relationships.Relationship) {
      if ($rel.Type -match '/image$' -and $rel.TargetMode -ne 'External') {
        $references += [PSCustomObject]@{ filename = [IO.Path]::GetFileName($rel.Target); owner = $entry.FullName }
      }
    }
  }
  $inventory = [PSCustomObject]@{ source = [IO.Path]::GetFileName($Source); slideCount = @($slideEntries).Count; images = $images; occurrences = $occurrences; references = $references }
  $inventory | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $root 'extraction.json') -Encoding utf8
  Write-Output "Extracted $($images.Count) original image files; $($occurrences.Count) picture occurrences in $(@($slideEntries).Count) slides."
  $occurrences | Group-Object slide | ForEach-Object { "Slide $($_.Name): " + (($_.Group | ForEach-Object { "$($_.filename) [$($_.name)]" }) -join ', ') }
} finally { $archive.Dispose() }

# Convert formats browsers cannot display. Keep every original byte-for-byte.
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase
[IO.Directory]::CreateDirectory((Join-Path $root 'converted')) | Out-Null
foreach ($file in (Get-ChildItem -LiteralPath (Join-Path $root 'originals') -Filter '*.emf')) {
  $metafile = [Drawing.Image]::FromFile($file.FullName)
  $bitmap = [Drawing.Bitmap]::new($metafile.Width * 2, $metafile.Height * 2)
  $graphics = [Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.Clear([Drawing.Color]::White)
    $graphics.DrawImage($metafile, 0, 0, $bitmap.Width, $bitmap.Height)
    $bitmap.Save((Join-Path $root ('converted/' + $file.Name + '.png')), [Drawing.Imaging.ImageFormat]::Png)
  } finally { $graphics.Dispose(); $bitmap.Dispose(); $metafile.Dispose() }
}
foreach ($file in (Get-ChildItem -LiteralPath (Join-Path $root 'originals') -Filter '*.wdp')) {
  $stream = [IO.File]::OpenRead($file.FullName)
  try {
    $decoder = [Windows.Media.Imaging.BitmapDecoder]::Create($stream, [Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat, [Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
    $encoder = [Windows.Media.Imaging.PngBitmapEncoder]::new()
    $encoder.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($decoder.Frames[0]))
    $converted = [IO.File]::Create((Join-Path $root ('converted/' + $file.Name + '.png')))
    try { $encoder.Save($converted) } finally { $converted.Dispose() }
  } finally { $stream.Dispose() }
}
