# SOL_Tools\Plot_tools.py

import numpy as np
import matplotlib.pyplot as plt
import pyvista as pv
import os
from PIL import Image

def DrawEarth3D(pl):
    # ------------------------------------------------------------
    # Textured 3D Earth using PyVista
    # ------------------------------------------------------------

    # Earth equatorial radius
    RE = 6378.137  # [km]

    # Local texture image file
    texture_file = os.path.join(os.path.dirname(__file__), "DATA/Images/World with Ice (4000x2000).jpg")
   
    # Read the Earth texture
    earth_texture = pv.read_texture(texture_file)

    if False:
        earth_texture = Image.open(texture_file)


        # Optional downsampling for faster plotting
        width, height = earth_texture.size

        factor = 20;
        new_width  = width  // factor
        new_height = height // factor

        # High-quality downsampling
        earth_texture = earth_texture.resize(
            (new_width, new_height),
            Image.Resampling.LANCZOS
        )


    #--- Arrow locations and directions

    centers = np.array([
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
    ])

    directions = np.array([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ])

    # Vector lengths
    lengths = np.linalg.norm(directions, axis=1)
    lengths = 1.5 * lengths * RE
    #print(lengths)

    # Unit direction vectors for orientation
    unit_directions = directions / lengths[:, None]

    #--- Build a point cloud carrying vectors and scale factors
    
    points = pv.PolyData(centers)

    points["directions"] = unit_directions
    points["lengths"] = lengths

    #--- Custom arrow geometry

    arrow_geom = pv.Arrow(
        start=(0.0, 0.0, 0.0),
        direction=(1.0, 0.0, 0.0),
        tip_length=0.25/5,
        tip_radius=0.08/7,      # ← controls tip width
        shaft_radius=0.025/7,   # ← controls shaft width
        tip_resolution=32,
        shaft_resolution=32,
        scale=1.0,
    )

    #--- Create glyph arrows
    arrows = points.glyph(
        orient="directions",
        scale="lengths",
        factor=1.0,
        geom=arrow_geom,
    )


    #--- Read texture image
    earth_texture = plt.imread(texture_file)

    # Convert image to floating point [0, 1] if needed
    #if img.dtype != np.float32 and img.dtype != np.float64:
    #    img = img.astype(float) / 255.0

    # Remove alpha channel if present
    if earth_texture.shape[2] == 4:
        earth_texture = earth_texture[:, :, :3]

    if False:
        # Optional downsampling for faster plotting
        step = 1
        earth_texture = earth_texture[::step, ::step, :]


    #--- Create the Earth sphere
    earth = pv.Sphere(
        radius=RE,
        theta_resolution=720,
        phi_resolution=360,
        start_theta=270.001,
        end_theta=270.0,
    )

    # Manually assign spherical texture coordinates
    #
    # This gives better control for latitude-longitude Earth maps.
    # The texture image is assumed to be:
    #   horizontal axis = longitude
    #   vertical axis   = latitude
    #   top             = North Pole

    points = earth.points

    x = points[:, 0]
    y = points[:, 1]
    z = points[:, 2]

    r = np.sqrt(x**2 + y**2 + z**2)

    # Texture coordinate u: longitude-like coordinate
    u = 0.5 + np.arctan2(-x, y) / (2.0 * np.pi)

    # Texture coordinate v: latitude-like coordinate
    v = 0.5 + np.arcsin(z / r) / np.pi

    # Store texture coordinates in the mesh
    earth.active_texture_coordinates = np.column_stack((u, v))

    pl.add_mesh(earth, texture=earth_texture, smooth_shading=True)

    pl.add_mesh(arrows, color="gray", smooth_shading=True)

    #--- Create equator line
    eps = 1.001  # Small radial offset so the equator line is visible on the surface
    theta = np.linspace(0.0, 2.0*np.pi, 720)
    x_eq = eps * RE * np.cos(theta)
    y_eq = eps * RE * np.sin(theta)
    z_eq = np.zeros_like(theta)
    equator_points = np.column_stack((x_eq, y_eq, z_eq))
    equator = pv.lines_from_points(equator_points, close=True)
    # Equator line
    pl.add_mesh(equator, color="blue", line_width=1)  #render_lines_as_tubes=True
    
    # Add a soft light
    pl.add_light(pv.Light(position=(20.0 * RE, 12.0 * RE, 0 * RE), focal_point=(0.0, 0.0, 0.0), intensity=0.5))

    # Camera position
    pl.camera_position = [
        (5 * RE, 4 * RE, 3 * RE),  # camera location
        (0.0, 0.0, 0.0),           # look-at point
        (0.0, 0.0, 1.0),           # up direction
    ]

    if False:
        # Place axes and grids on the back faces
        max_pos = 9000;
        pl.show_bounds(
            bounds=[-max_pos, max_pos, -max_pos, max_pos, -max_pos, max_pos],
            #grid='back',
            location='outer',
            all_edges=False,  #Removes front-facing boundary lines that obscure the view.
            #all_edges=True,  
            xtitle='X',
            ytitle='Y',
            ztitle='Z',
            fmt='%.0f'  
        )

        """""
        Find a way to write text
            x, y, z = 1.0, 2.0, 3.0
            symbol = r'$\alpha$'  # LaTeX string for the alpha symbol
            # Write text at the 3D coordinates
            ax.text(0.0, 0.0, 7000.0, 'Z', fontsize=15, color='red')
         
            pl.add_point_labels(
                points=[[0.0, 0.0, 9000.0]],
                labels=["Z"],
                point_size=10,
                text_color="blue",
            )
        """""

    # Use terrain-style interaction: Z remains the natural up direction
    pl.enable_terrain_style(
        mouse_wheel_zooms=True,
        shift_pans=False
    )
    pl.show_axes()  # Adds the RGB orientation marker widget

    # ? .set_box_aspect([1, 1, 1])

    return pl
