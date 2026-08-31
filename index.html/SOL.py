# ============================================================
# SOL.py
# SpaceOrbitLAB
#
# Main interface for the SOL_Tools library.
# This file provides a single access point to the orbital
# mechanics functions used by the website simulations.
# ============================================================


# =========================
# ASTRO CONSTANTS
# =========================

from SOL_Tools.AstroConstants import (
    Earth
)


# =========================
# MATHEMATICAL TOOLS
# =========================

from SOL_Tools.Math_tools import (
    sind,
    cosd,
    tand,
    RotX,
    RotY,
    RotZ
)


# =========================
# ORBITAL MECHANICS TOOLS
# =========================

from SOL_Tools.Orbit_tools import (
    OrbitPropagation_2BN,
    Rates_Newton,
    OrbitPropagation_2BK,
    KeplerSolver,
    COE_to_SV
)


# =========================
# PUBLIC SOL INTERFACE
# =========================

__all__ = [

    # AstroConstants
    "Earth",

    # Math_tools
    "sind",
    "cosd",
    "tand",
    "RotX",
    "RotY",
    "RotZ",

    # Orbit_tools
    "OrbitPropagation_2BN",
    "Rates_Newton",
    "OrbitPropagation_2BK",
    "KeplerSolver",
    "COE_to_SV"
]