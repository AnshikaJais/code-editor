const CustomInput = ({ customInput, setCustomInput }) => {
    return (
        <>
            <textarea
                row="5"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Custom Input"
                className="focus:outline-none w-full border-2 border-black z-10 rounded-lg shadow-[5px_5px_0px_0px_rgba(0, 0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2 h-[10rem]"
            ></textarea>
        </>
    );
};

export default CustomInput;
