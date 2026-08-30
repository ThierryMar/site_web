# SOL_Tools\AstroConstants.py
# → Progressively import parameters as needed from AstroConstants.m & DefineConstants.m

import numpy as np
#from typing import Final

# Basic global constants
# MY_PI: Final = 3.14159
#DATABASE_URL: Final = "sqlite:///my_database.db"
#MAX_LOGIN_ATTEMPTS: Final = 5

class Earth:
    
    mu = 398600.4418  # [km³/s²]  Earth gravitational parameter

    r1_km = 6378.137  # [km]  Earth equatorial radius ; Radius (at sea level) at equator
    r2_km = 6356.75231424518  # [km]  Earth polar radius (at sea level)

    # Eccentricity of the Earth's oblate ellipsoidal shape  e ≡ √(1 – (b/a)²) = sin(θ)
    ecc = np.sqrt(1 - (r2_km / r1_km)**2)  # [n.u.] 
