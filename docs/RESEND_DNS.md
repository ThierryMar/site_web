# Configuration DNS Resend

Domaine ajouté dans Resend : `spaceorbitlab.com`.
Les enregistrements ci-dessous ont été fournis par Resend le 14 septembre 2026.
Ils doivent être ajoutés dans Namecheap, dans **Advanced DNS → Host Records**.
TTL : Automatic. Ne pas remplacer un enregistrement existant sans vérifier son usage.

| Type | Host | Value |
| --- | --- | --- |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDae8pMqLv8eP+cfM32fC8VoEBgVKpRiDeoJOEPuky+7Jmnhd8OALpWbpR++hZjotPcx/T3pb4Osv4O2pZk9zSkJDvkY2pPOsEx10xmubqlErydBiozoCliDk44EOxUUPsqO10BFOABZLxv76JSm3PrrIqK38/AqgSgF7OsL1p4JQIDAQAB` |
| CNAME | `rsend` | `rsend.forge.rmta.net` |
| CNAME | `send` | `send.forge.rmta.net` |

Ces valeurs sont publiques ; elles ne contiennent pas de clé API secrète.
La réception des courriels n'est pas activée dans Resend.

Après ajout, lancer la vérification dans [Resend](https://resend.com/domains/add/97a35fb4-0da5-4799-8d91-c3c8171ffee9).
Une fois le domaine vérifié, utiliser `EMAIL_FROM=noreply@spaceorbitlab.com`.
La clé API doit rester dans `.env.local` (ignoré par Git) ou dans les variables privées de l'hébergeur.
