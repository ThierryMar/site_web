#exercices cours Richard
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
import matplotlib.pyplot as plt
import numpy as np

import math

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





# Fichier de test des fonctions à implémenter sur le site web.

minsec = 1/60 # Conversion de minutes en degrés
arcsec = 1/60**2 # Conversion d'arcsecondes en degrés

parsec = Earth.AU / tand(1*arcsec) # Conversion de parsec en km

D = 10 # distance du point

FOV = 1 + 1*minsec + 1*arcsec # Champ de vision en degrés

rayon_objet = math.tan(FOV/2) * D

print("Rayon de l'objet : ", rayon_objet, "m")

