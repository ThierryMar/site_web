import numpy as np
import pyvista as pv

# Fonction SOL Richard

from SOL_Tools.AstroConstants import *
from SOL_Tools.Orbit_tools import OrbitPropagation_2BN, OrbitPropagation_2BK
from SOL_Tools.Plot_tools import DrawEarth3D






# Matrices de rotation

def RotX(angle):
    return np.array([[1, 0, 0],
                    [0, np.cos(angle), -np.sin(angle)],
                    [0, np.sin(angle), np.cos(angle)]])

def RotZ(angle):
    return np.array([[np.cos(angle), -np.sin(angle), 0],
                    [np.sin(angle), np.cos(angle), 0],
                    [0, 0, 1]])

# Anomalies

def true_to_eccentric_anomaly(nu, e):
    """
    Convert true anomaly to eccentric anomaly
    for an elliptical orbit.

    Parameters
    ----------
    nu : float
        True anomaly in radians.

    e : float
        Orbital eccentricity.
        Must satisfy 0 <= e < 1.

    Returns
    -------
    float
        Eccentric anomaly in radians.
    """

    if not 0 <= e < 1:
        raise ValueError(
            "Eccentricity must satisfy 0 <= e < 1."
        )

    numerator = (
        np.sqrt(1 - e) * np.sin(nu / 2)
    )

    denominator = (
        np.sqrt(1 + e) * np.cos(nu / 2)
    )

    E = 2 * np.arctan2(
        numerator,
        denominator
    )

    return np.mod(E, 2 * np.pi)


def solve_kepler(M, e, tol=1e-12, max_iter=50):
    """
    Solve Kepler's equation

        M = E - e sin(E)

    using Newton-Raphson iteration.

    Parameters
    ----------
    M : float
        Mean anomaly in radians.

    e : float
        Orbital eccentricity.
        Must satisfy 0 <= e < 1.

    tol : float, optional
        Convergence tolerance.

    max_iter : int, optional
        Maximum number of iterations.

    Returns
    -------
    float
        Eccentric anomaly E in radians.
    """

    if not 0 <= e < 1:
        raise ValueError(
            "Eccentricity must satisfy 0 <= e < 1."
        )

    M = np.mod(M, 2 * np.pi)

    # Initial estimate
    if e < 0.8:
        E = M
    else:
        E = np.pi

    for _ in range(max_iter):

        f = E - e * np.sin(E) - M
        fp = 1 - e * np.cos(E)

        delta = f / fp

        E -= delta

        if abs(delta) < tol:
            return E

    raise RuntimeError(
        "Kepler solver did not converge."
    )













# Éléments orbitaux classiques -> Position et vitesse dans le référentiel inertiel

def coe_to_rv(a, e, i, RAAN, argp, nu, mu):
    """
    Convert classical orbital elements (COE)
    to Cartesian position and velocity vectors.

    Parameters
    ----------
    a : float
        Semi-major axis in km.

    e : float
        Orbital eccentricity.

    i : float
        Inclination in radians.

    RAAN : float
        Right ascension of the ascending node
        in radians.

    argp : float
        Argument of periapsis in radians.

    nu : float
        True anomaly in radians.

    mu : float
        Gravitational parameter in km^3/s^2.

    Returns
    -------
    r : numpy.ndarray
        Position vector [x, y, z] in km.

    v : numpy.ndarray
        Velocity vector [vx, vy, vz] in km/s.
    """

    if a <= 0:
        raise ValueError(
            "Semi-major axis must be positive."
        )

    if not 0 <= e < 1:
        raise ValueError(
            "Eccentricity must satisfy 0 <= e < 1."
        )

    if mu <= 0:
        raise ValueError(
            "Gravitational parameter mu must be positive."
        )

    # Semi-latus rectum
    p = a * (1 - e**2)

    # Position in perifocal frame
    r_pf = (
        p / (1 + e * np.cos(nu))
    ) * np.array([
        np.cos(nu),
        np.sin(nu),
        0.0
    ])

    # Velocity in perifocal frame
    v_pf = np.sqrt(mu / p) * np.array([
        -np.sin(nu),
        e + np.cos(nu),
        0.0
    ])

    # Rotation from perifocal frame to inertial frame
    rotation_matrix = (
        RotZ(RAAN)
        @ RotX(i)
        @ RotZ(argp)
    )

    r = rotation_matrix @ r_pf
    v = rotation_matrix @ v_pf

    return r, v










# Problème à deux corps

def propagate_2bk_from_coe(
    a,
    e,
    i_deg,
    RAAN_deg,
    argp_deg,
    nu0_deg,
    t_array,
    mu=398600.4418
):
    """
    Propagate an elliptical orbit using the
    two-body Keplerian model.

    Parameters
    ----------
    a : float
        Semi-major axis in km.

    e : float
        Orbital eccentricity.

    i_deg : float
        Inclination in degrees.

    RAAN_deg : float
        Right ascension of the ascending node
        in degrees.

    argp_deg : float
        Argument of periapsis in degrees.

    nu0_deg : float
        Initial true anomaly in degrees.

    t_array : array-like
        Times at which the orbit is evaluated,
        in seconds from the initial epoch.

    mu : float, optional
        Gravitational parameter in km^3/s^2.

        Default:
        Earth = 398600.4418 km^3/s^2

    Returns
    -------
    r_array : numpy.ndarray
        Array of position vectors.
        Shape: (N, 3), units: km.

    v_array : numpy.ndarray
        Array of velocity vectors.
        Shape: (N, 3), units: km/s.
    """

    if a <= 0:
        raise ValueError(
            "Semi-major axis must be positive."
        )

    if not 0 <= e < 1:
        raise ValueError(
            "Eccentricity must satisfy 0 <= e < 1."
        )

    if mu <= 0:
        raise ValueError(
            "Gravitational parameter mu must be positive."
        )

    # Convert angles from degrees to radians
    i = np.deg2rad(i_deg)
    RAAN = np.deg2rad(RAAN_deg)
    argp = np.deg2rad(argp_deg)
    nu0 = np.deg2rad(nu0_deg)

    t_array = np.asarray(
        t_array,
        dtype=float
    )

    # Initial eccentric anomaly
    E0 = true_to_eccentric_anomaly(
        nu0,
        e
    )

    # Initial mean anomaly
    M0 = E0 - e * np.sin(E0)

    # Mean motion
    n = np.sqrt(mu / a**3)

    r_array = []
    v_array = []

    for t in t_array:

        # Mean anomaly at time t
        M = M0 + n * t

        # Solve Kepler's equation
        E = solve_kepler(
            M,
            e
        )

        # Convert eccentric anomaly
        # back to true anomaly
        nu = 2 * np.arctan2(
            np.sqrt(1 + e) * np.sin(E / 2),
            np.sqrt(1 - e) * np.cos(E / 2)
        )

        # Position and velocity
        r, v = coe_to_rv(
            a,
            e,
            i,
            RAAN,
            argp,
            nu,
            mu
        )

        r_array.append(r)
        v_array.append(v)

    return (
        np.asarray(r_array),
        np.asarray(v_array)
    )