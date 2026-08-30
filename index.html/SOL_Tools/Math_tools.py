# SOL_Tools\Math_tools.py

import numpy as np

def sind(angle):
    return np.sin(np.deg2rad(angle))
def cosd(angle):
    return np.cos(np.deg2rad(angle))
def tand(angle):
    return np.tan(np.deg2rad(angle))


def RotX(angle):
# Rotation matrix around X axis (3×3)  X′ = R * X
# As standard mathematical convention, https://en.wikipedia.org/wiki/Rotation_matrix
#
# like Battin 1999, Chobotov 2002 (4.108), but unlike Bate 1971 (Eq.2.6-8) and Curtis 2020 (Eq. 4.32)
# who use a different convention (Vallado 2013, Section 3.4.1 p.162-168)

# The transformation matrix R corresponding to a single rotation of the coordinate frame about the positive X axis
# through a positive angle t_deg, counterclockwise, or Right-Hand-Rule (RHR) is:

    c = cosd(angle)
    s = sind(angle)

    return np.array([
        [1.0, 0.0, 0.0],
        [0.0,   c,  -s],
        [0.0,   s,   c]
    ])


def RotY(angle):
# Rotation matrix around Y axis (3×3), counterclockwise (RHR)
# https://en.wikipedia.org/wiki/Rotation_matrix
    
    c = cosd(angle)
    s = sind(angle)

    return np.array([
        [  c, 0.0,   s],
        [0.0, 1.0, 0.0],
        [ -s, 0.0,   c]
    ])



def RotZ(angle):
# Rotation matrix around Z axis (3×3), counterclockwise (RHR)
# https://en.wikipedia.org/wiki/Rotation_matrix

    c = cosd(angle)
    s = sind(angle)

    return np.array([
        [ c, -s, 0.0],
        [ s,  c, 0.0],
        [0.0, 0.0, 1.0]
    ])
