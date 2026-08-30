# SOL_Tools\Oorbit_tools.py

import numpy as np
from scipy.integrate import solve_ivp
from SOL_Tools.AstroConstants import Earth
from SOL_Tools.Math_tools import *


def OrbitPropagation_2BN(SV, time_s):
# Computes orbit solving Newton's equation on time vector

    t_span = np.array([time_s[0], time_s[-1]]);

    # Solve using RK45 (Python's ode45 equivalent)
    sol = solve_ivp(Rates_Newton, t_span, SV, t_eval=time_s, method='RK45', rtol=1e-10, atol=1e-12)

    # (here ".y" does not mean the 2nd 3D dimension)
    ECI_pos_2BN = sol.y[0:3, :]  # first 3 elements
    ECI_vel_2BN = sol.y[3:6, :]  # last 3 elements

    return ECI_pos_2BN, ECI_vel_2BN

def Rates_Newton(t, z):

    r_vec = z[0:3]
    v_vec = z[3:6]

    r = np.linalg.norm(r_vec)

    dzdt = np.zeros(6)
    dzdt[0:3] = v_vec
    dzdt[3:6] = -Earth.mu * r_vec / r**3

    return dzdt


def OrbitPropagation_2BK(a, e, i, RAAN, w, nu0, t_array, mu):
# Two-Body Keplerian Orbit Propagation from COEs
    """
    Propagate an elliptic orbit using the two-body Keplerian method.

    Inputs:
        a       : semi-major axis [km]
        e       : eccentricity [-]
        i       : inclination [°]
        RAAN    : right ascension of ascending node [°]
        w       : argument of perigee [°]
        nu0     : true anomaly at epoch [°]
        t_array : time since epoch [s]
        mu      : gravitational parameter [km³/s²]

    Outputs:
        ECI_pos : position history, shape (N, 3) [km]
        ECI_vel : velocity history, shape (N, 3) [km/s]
        nu_all  : true anomaly history [rad]
    """

    if e >= 1.0:
        raise ValueError(">>> OrbitPropagation_2BK: This implementation is for elliptic orbits only: e < 1.")

    # Initial eccentric anomaly
    E0 = 2.0 * np.arctan2(np.sqrt(1.0 - e) * sind(nu0 / 2.0), np.sqrt(1.0 + e) * cosd(nu0 / 2.0))  # [rad]

    # Initial mean anomaly
    M0 = E0 - e * np.sin(E0)  # [rad]

    # Mean motion
    n = np.sqrt(mu / a**3)  # [rad/s]

    # Pre-allocate output arrays  (use float instead of double to save space)
    N = len(t_array)
    ECI_pos = np.zeros((3, N), dtype=float)
    ECI_vel = np.zeros((3, N), dtype=float)
    nu_all  = np.zeros(N, dtype=float)

    # Point-by-point calculation along the orbit
    # KeplerSolver is assumed to operate on scalar mean anomalies
    for k, t in enumerate(t_array):  # (do not use i as a loop counter as here it represents inclination)

        # Mean anomaly at time t
        M = M0 + n * t  # [rad]

        # Solve Kepler equation
        E, nu = KeplerSolver(M, e)  # [rad]
        nu = np.rad2deg(nu)  # [°]

        # Convert COEs to inertial state
        R, V = COE_to_SV(a, e, i, RAAN, w, nu, mu)   

        # Store directly as columns in 3 x N arrays
        ECI_pos[:, k] = np.asarray(R, dtype=float).reshape(3)
        ECI_vel[:, k] = np.asarray(V, dtype=float).reshape(3)

        # Store true anomaly
        nu_all[k] = nu
        # (could also store Eccentric Anomaly and return as a vector)

    return ECI_pos, ECI_vel, nu_all


def KeplerSolver(M, e, tol=1e-12, max_iter=50):
    """
    Solve Kepler's equation:  M = E - e sin(E) 

    Inputs:
        M : mean anomaly [rad]
        e : eccentricity [n.u.]

    Output:
        E : eccentric anomaly [rad]
        ν : True Anomaly [rad]

    *** All angles are in radians here ***
    """

    # Wraps M to improve convergence
    M = np.mod(M, 2*np.pi)

    # Initial guess
    if e < 0.8:
        E = M
    else:
        E = np.pi

    #--- Newton’s method to solve Kepler Equation
    for _ in range(max_iter):
        f = E - e * np.sin(E) - M
        fp = 1.0 - e * np.cos(E)

        dE = -f / fp
        E = E + dE

        if abs(dE) < tol:
            break

    #--- Converts eccentric anomaly to true anomaly
    nu = np.arctan2(np.sqrt(1.0 - e**2) * np.sin(E), np.cos(E) - e)  # [rad]

    return E, nu


def COE_to_SV(a, e, i, RAAN, argp, nu, mu):
    """
    Convert classical orbital elements to inertial position and velocity (ECI)

    Inputs:
        a    : semi-major axis [km]
        e    : eccentricity [-]
        i    : inclination [°]
        RAAN : right ascension of ascending node [°]
        argp : argument of perigee [°]
        nu   : true anomaly [°]
        mu   : gravitational parameter [km³/s²]

    Outputs:
        R : inertial position vector [km]
        V : inertial velocity vector [km/s]
    """

    p = a * (1.0 - e**2)  # ellipse semi-latus rectum
    r = p / (1.0 + e * cosd(nu))  # radius in ellipse at ν

    r_PQW = np.array([r * cosd(nu), r * sind(nu), 0.0])
    v_PQW = np.sqrt(mu / p) * np.array([-sind(nu), e + cosd(nu), 0.0])

    #--- Rotation from perifocal PQW frame to inertial ECI frame
    Rot_PQW_to_ECI = RotZ(RAAN) @ RotX(i) @ RotZ(argp)

    R = Rot_PQW_to_ECI @ r_PQW
    V = Rot_PQW_to_ECI @ v_PQW

    return R, V