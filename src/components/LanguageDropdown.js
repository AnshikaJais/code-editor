import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";

import { languageOptions } from "../constants/languageOptions";

const LanguageDropdown = ({ onSelectChange }) => {
    return (
        <Select
            placeholder={`Filter by category`}
            styles={customStyles}
            options={languageOptions}
            defaultValue={languageOptions[0]}
            onChange={(selectedChange) => onSelectChange(selectedChange)}
        />
    );
};

export default LanguageDropdown;
