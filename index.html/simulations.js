"use strict";

/* =========================
   GLOBAL VARIABLES
========================= */

let pyodideInstance = null;

const originalCode = new Map();

const statusElement = document.getElementById("python-status");
const statusText = statusElement.querySelector("span:last-child");


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

    setGlobalStatus(
        "Loading Python, NumPy, and Matplotlib…",
        "loading"
    );

    try {
        pyodideInstance = await loadPyodide();

        await pyodideInstance.loadPackage([
            "numpy",
            "matplotlib"
        ]);

        setGlobalStatus(
            "Python is ready. You can run the simulations.",
            "ready"
        );

        setRunButtonsDisabled(false);

    } catch (error) {
        console.error(error);

        setGlobalStatus(
            "Python could not be loaded. Check your internet connection and reload the page.",
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

    const editor = document.getElementById(editorId);
    const consoleOutput = document.getElementById(consoleId);
    const resultImage = document.getElementById(imageId);

    const placeholder = resultImage.previousElementSibling;


    if (!pyodideInstance) {
        consoleOutput.textContent =
            "Python is still loading. Please wait.";

        return;
    }


    const initialButtonText = button.textContent.trim();

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
     * The Python code written in the editor is transferred
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
     * 4. Converts the Matplotlib figure to a Base64 image.
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

    with contextlib.redirect_stdout(_stdout_buffer):
        exec(_user_code, {})

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
         * Conversion of the Python dictionary
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
   START PYTHON
========================= */

initializePython();