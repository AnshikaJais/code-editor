import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { languageOptions } from "../constants/languageOptions.js";
import CodeEditorWindow from "./CodeEditorWindow.js";
import OutputDetails from "./OutputDetails.js";
import CustomInput from "./CustomInput.js";
import LanguageDropdown from "./LanguageDropdown.js";
import ThemeDropdown from "./ThemeDropdown.js";
import OutputWindow from "./OutputWindow.js";
import { getClassNames } from "../utils/getClassNames.js";
import { defineTheme } from "../lib/defineThemes.js";
import useKeyPress from "../hooks/useKeyPress.js";


const javascriptDefault = `/**
* Problem: Factorial of a number */

const fact = (n) =>{
    var fac = 1;
    for(var i=1; i<=n; i++) fac *= i;

    return fac;
}

const n = 5;
console.log(fact(n));
`;

const Landing = () => {
    const [code, setCode] = useState(javascriptDefault);
    const [theme, setTheme] = useState("cobalt");
    const [customInput, setCustomInput] = useState("");
    const [outputDetails, setOutputDetails] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [language, setLanguage] = useState(languageOptions[0]);

    const enter = useKeyPress("Enter");
    const ctrl = useKeyPress("Control");

    const onSelectChange = (lg) => {
        setLanguage(lg);
    };

    useEffect(() => {
        if (enter && ctrl) {
            handleCompile();
        }
    }, );

    const onChange = (action, data) => {
        switch (action) {
            case "code": {
                setCode(data);
                break;
            }
            default: {
                console.warn("case not handled!");
            }
        }
    };

    function handleCompile  ()  {
        setProcessing(true);

        const formData = {
            language_id: language.id,
            source_code: btoa(code),
            stdin: btoa(customInput),
        };

        const options = {
            method: "POST",
            url: process.env.REACT_APP_RAPID_API_URL + "/submissions",
            params: {
                base64_encoded: true,
                fields: "*",
            },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
            },
            data: formData,
        };

        axios
            .request(options)
            .then(function (res) {
                const token = res.data.token;
                checkStatus(token);
            })
            .catch((err) => {
                let error = err.response ? err.response : err;
                const status = err.response.status;
                if (status === 429) {
                    console.log("Too many request");
                    showErrorToast(
                        `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
                        10000
                    );
                }
                setProcessing(false);
                showErrorToast(error);
                console.log("catch block...", error);
            });
    };

    const checkStatus = async (token) => {
        const options = {
            method: "GET",
            url: process.env.REACT_APP_RAPID_API_URL + "/submissions/" + token,
            params: { base64_encoded: false, fields: "*" },
            headers: {
                "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
            },
        };

        try {
            const response = await axios.request(options);

            const statusId = response.data.status?.id;

            // Processed - we have a result
            if (statusId === 1 || statusId === 2) {
                // still processing
                setTimeout(() => {
                    checkStatus(token);
                }, 2000);
                return;
            } else {
                setProcessing(false);
                setOutputDetails(response.data);
                showSuccessToast(`Compiled Successfully`);
            }
        } catch (error) {
            console.error(error);
            setProcessing(false);
            showErrorToast();
        }
    };

    const handleThemeChange = (th) => {
        if (["light", "vs-dark"].includes(th.value)) {
            setTheme(th);
        } else {
            defineTheme(th.value).then((_) => setTheme(th));
        }
    };

    useEffect(() => {
        defineTheme("oceanic-next").then((_) =>
            setTheme({ value: "oceanic-next", label: "Oceanic Next" })
        );
    }, []);

    const showSuccessToast = (msg) => {
        toast.success(msg || "Compiled Successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const showErrorToast = (msg) => {
        toast.error(msg || "Something went wrong! Please try again", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                &nbsp;
            </div>
            <div className="flex flex-row mt-2">
                <div className="px-4 py-2">
                    <LanguageDropdown onSelectChange={onSelectChange} />
                </div>
                <div className="px-4 py-2">
                    <ThemeDropdown
                        handleThemeChange={handleThemeChange}
                        theme={theme}
                    />
                </div>
            </div>
            <div className="flex lg:flex-row flex-col space-x-4 items-start px-4 py-4">
                <div className="flex flex-col justify-start items-end md:items-start w-full h-full">
                    <CodeEditorWindow
                        onChange={onChange}
                        code={code}
                        language={language?.value}
                        theme={theme?.value}
                    />
                </div>
                <div className="flex flex-col flex-shrink-0 lg:w-[30%] sm:w-[96%] md:space-x-0">
                    <OutputWindow outputDetails={outputDetails} />
                    <div className="flex flex-col h-[10rem]">
                        <CustomInput
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                        />
                    </div>
                    <button
                        onClick={handleCompile}
                        disabled={!code}
                        className={getClassNames(
                            `mt-4 border-2 sm:w-[15rem] border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0`,
                            !code ? "opacity-50" : ""
                        )}
                    >
                        {processing ? "Processing..." : "Compile and Execute"}
                    </button>

                    {outputDetails && (
                        <OutputDetails outputDetails={outputDetails} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Landing;
