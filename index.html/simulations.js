"use strict";

/* =========================
   GLOBAL VARIABLES
========================= */

let pyodideInstance = null;

const originalCode = new Map();

const statusElement =
    document.getElementById("python-status");

const statusText =
    statusElement.querySelector("span:last-child");


/* =========================
   PYTHON STATUS
========================= */


function setGlobalStatus(message, state) {
    statusText.textContent = message;
    statusElement.dataset.state = state;
}


function setRunButtonsDisabled(disabled) {
    document
        .querySelectorAll(".bouton-execution")
        .forEach((button) => {
            button.disabled = disabled;
        });
}


/* =========================
   PYODIDE INITIALIZATION
========================= */

async function initializePython() {

    setRunButtonsDisabled(true);

    try {

        /* =========================
           1. PYODIDE
        ========================= */

        setGlobalStatus(
            "Loading Python environment…",
            "loading"
        );

        console.log("Loading Pyodide...");

        pyodideInstance = await loadPyodide({
            indexURL:
                "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/"
        });

        console.log("Pyodide loaded successfully");


        /* =========================
           2. PYTHON LIBRARIES
        ========================= */

        setGlobalStatus(
            "Loading Python libraries…",
            "loading"
        );

        console.log(
            "Loading NumPy, SciPy and Matplotlib..."
        );

        await pyodideInstance.loadPackage([
            "numpy",
            "scipy",
            "matplotlib"
        ]);

        console.log(
            "Core Python libraries loaded"
        );


        /* =========================
           3. SOL LIBRARY
        ========================= */

        setGlobalStatus(
            "Loading SOL library…",
            "loading"
        );

        console.log("Loading SOL library...");


        /*
         * Function used to load a Python file
         * from the website into Pyodide.
         */

        async function loadPythonFile(
            websitePath,
            pyodidePath
        ) {

            const response =
                await fetch(websitePath);

            if (!response.ok) {

                throw new Error(
                    `${websitePath} not found — HTTP ${response.status}`
                );

            }

            const code =
                await response.text();

            pyodideInstance.FS.writeFile(
                pyodidePath,
                code,
                {
                    encoding: "utf8"
                }
            );
        }


        /*
         * Create SOL_Tools package folder
         * inside Pyodide.
         */

        try {

            pyodideInstance.FS.mkdir(
                "/home/pyodide/SOL_Tools"
            );

        } catch (error) {

            // Folder may already exist.

        }


        /*
         * Load SOL_Tools package.
         */


        await loadPythonFile(
            "./SOL_Tools/AstroConstants.py",
            "/home/pyodide/SOL_Tools/AstroConstants.py"
        );

        await loadPythonFile(
            "./SOL_Tools/Math_tools.py",
            "/home/pyodide/SOL_Tools/Math_tools.py"
        );

        await loadPythonFile(
            "./SOL_Tools/Orbit_tools.py",
            "/home/pyodide/SOL_Tools/Orbit_tools.py"
        );


        /*
         * Load main SOL library.
         */

        await loadPythonFile(
            "./SOL.py",
            "/home/pyodide/SOL.py"
        );

        console.log("SOL library loaded");


        /* =========================
        4. TEST SOL
        ========================= */

        console.log("Testing SOL import...");

        await pyodideInstance.runPythonAsync(`
        import SOL

        print("SOL imported successfully")
        print("Earth mu:", SOL.Earth.mu)

        print(
            "OrbitPropagation_2BN available:",
            hasattr(SOL, "OrbitPropagation_2BN")
        )

        print(
            "Rates_Newton available:",
            hasattr(SOL, "Rates_Newton")
        )

        print(
            "OrbitPropagation_2BK available:",
            hasattr(SOL, "OrbitPropagation_2BK")
        )

        print(
            "KeplerSolver available:",
            hasattr(SOL, "KeplerSolver")
        )

        print(
            "COE_to_SV available:",
            hasattr(SOL, "COE_to_SV")
        )

        print(
            "sind available:",
            hasattr(SOL, "sind")
        )

        print(
            "cosd available:",
            hasattr(SOL, "cosd")
        )

        print(
            "tand available:",
            hasattr(SOL, "tand")
        )

        print(
            "RotX available:",
            hasattr(SOL, "RotX")
        )

        print(
            "RotY available:",
            hasattr(SOL, "RotY")
        )

        print(
            "RotZ available:",
            hasattr(SOL, "RotZ")
        )
        `);

        console.log("SOL import successful");


        /* =========================
           READY
        ========================= */

        setGlobalStatus(
            "Python is ready. You can run the simulations.",
            "ready"
        );

        setRunButtonsDisabled(false);

    } catch (error) {

        console.error(
            "Python initialization error:",
            error
        );

        setGlobalStatus(
            `Initialization error: ${error.message}`,
            "error"
        );
    }
}


/* =========================
   EXECUTE A SIMULATION
========================= */

async function executeSimulation(button) {
    const editorId = button.dataset.editor;
    const consoleId = button.dataset.console;
    const imageId = button.dataset.image;

    const editor =
        document.getElementById(editorId);

    const consoleOutput =
        document.getElementById(consoleId);

    const resultImage =
        document.getElementById(imageId);

    const placeholder =
        resultImage.previousElementSibling;


    if (!pyodideInstance) {
        consoleOutput.textContent =
            "Python is still loading. Please wait.";

        return;
    }


    const initialButtonText =
        button.textContent.trim();

    button.disabled = true;
    button.textContent = "Running…";

    consoleOutput.textContent =
        "Executing Python code…";

    resultImage.hidden = true;
    resultImage.removeAttribute("src");

    placeholder.hidden = false;
    placeholder.textContent =
        "Generating the result…";


    /*
     * Transfer the Python code from the editor
     * to the Pyodide environment.
     */

    pyodideInstance.globals.set(
        "_user_code",
        editor.value
    );


    /*
     * This Python wrapper:
     *
     * 1. Executes the user's code.
     * 2. Captures print() output.
     * 3. Captures Python errors.
     * 4. Converts the Matplotlib figure
     *    into a Base64 image.
     */

    const executionWrapper = `
import base64
import contextlib
import io
import traceback
import matplotlib.pyplot as plt

_stdout_buffer = io.StringIO()
_error_text = ""
_image_base64 = ""

try:
    plt.close("all")

    plt.show = lambda *args, **kwargs: None

    with contextlib.redirect_stdout(_stdout_buffer):
        exec(_user_code, globals())

    if plt.get_fignums():
        _image_buffer = io.BytesIO()

        plt.gcf().savefig(
            _image_buffer,
            format="png",
            dpi=150,
            bbox_inches="tight",
            facecolor="white"
        )

        _image_base64 = base64.b64encode(
            _image_buffer.getvalue()
        ).decode("ascii")

except Exception:
    _error_text = traceback.format_exc()

finally:
    plt.close("all")

{
    "output": _stdout_buffer.getvalue(),
    "error": _error_text,
    "image": _image_base64
}
`;


    try {
        const pythonResult =
            await pyodideInstance.runPythonAsync(
                executionWrapper
            );


        /*
         * Convert the Python dictionary
         * into a JavaScript object.
         */

        const result = pythonResult.toJs({
            dict_converter: Object.fromEntries
        });

        pythonResult.destroy();


        /*
         * Display Python errors.
         */

        if (result.error) {
            consoleOutput.textContent =
                result.error;

            placeholder.textContent =
                "The simulation encountered an error.";

            return;
        }


        /*
         * Display print() output.
         */

        consoleOutput.textContent =
            result.output ||
            "Code executed successfully.";


        /*
         * Display the Matplotlib figure.
         */

        if (result.image) {
            resultImage.src =
                `data:image/png;base64,${result.image}`;

            resultImage.hidden = false;
            placeholder.hidden = true;

        } else {
            placeholder.textContent =
                "The code did not generate a Matplotlib figure.";
        }

    } catch (error) {
        console.error(error);

        consoleOutput.textContent =
            String(error);

        placeholder.textContent =
            "The simulation could not be completed.";

    } finally {
        pyodideInstance.globals.delete(
            "_user_code"
        );

        button.disabled = false;
        button.textContent =
            initialButtonText;
    }
}


/* =========================
   RESET A SIMULATION
========================= */

function resetSimulation(editorId) {
    const editor =
        document.getElementById(editorId);

    const initialCode =
        originalCode.get(editorId);

    if (editor && initialCode !== undefined) {
        editor.value = initialCode;
    }
}


/* =========================
   SAVE INITIAL CODE
========================= */

document
    .querySelectorAll(".editeur-python")
    .forEach((editor) => {
        const cleanedCode =
            editor.value.trim();

        originalCode.set(
            editor.id,
            cleanedCode
        );

        editor.value =
            cleanedCode;
    });


/* =========================
   RUN BUTTONS
========================= */

document
    .querySelectorAll(".bouton-execution")
    .forEach((button) => {
        button.addEventListener(
            "click",
            () => executeSimulation(button)
        );
    });


/* =========================
   RESET BUTTONS
========================= */

document
    .querySelectorAll("[data-reset]")
    .forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                resetSimulation(
                    button.dataset.reset
                );
            }
        );
    });


/* =========================
   SIMULATION SELECTOR
========================= */

const simulationSelector =
    document.getElementById(
        "simulation-selector"
    );

const openSimulationButton =
    document.getElementById(
        "open-simulation"
    );

const simulationDisplay =
    document.getElementById(
        "simulation-display"
    );

const simulationPlaceholder =
    document.getElementById(
        "simulation-placeholder"
    );

const simulationStorage =
    document.getElementById(
        "simulation-storage"
    );

let currentSimulation = null;


if (
    simulationSelector &&
    openSimulationButton &&
    simulationDisplay &&
    simulationStorage
) {

    /*
     * Enable the button after selecting
     * a simulation.
     */

    simulationSelector.addEventListener(
        "change",
        () => {
            openSimulationButton.disabled =
                !simulationSelector.value;
        }
    );


    /*
     * Display the selected simulation.
     */

    openSimulationButton.addEventListener(
        "click",
        () => {
            const selectedSection =
                document.querySelector(
                    simulationSelector.value
                );

            if (!selectedSection) {
                console.error(
                    "Simulation not found:",
                    simulationSelector.value
                );

                return;
            }


            /*
             * Return the currently displayed
             * simulation to the hidden storage.
             */

            if (
                currentSimulation &&
                currentSimulation !== selectedSection
            ) {
                currentSimulation.hidden = true;

                simulationStorage.appendChild(
                    currentSimulation
                );
            }


            /*
             * Move the selected simulation
             * into the visible display zone.
             */

            simulationDisplay.appendChild(
                selectedSection
            );

            selectedSection.hidden = false;

            currentSimulation =
                selectedSection;


            /*
             * Hide the initial placeholder.
             */

            if (simulationPlaceholder) {
                simulationPlaceholder.hidden = true;
            }


            /*
             * Scroll to the displayed simulation.
             */

            simulationDisplay.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            /*
             * Update the URL.
             */

            window.history.replaceState(
                null,
                "",
                simulationSelector.value
            );
        }
    );
}

initializePython();