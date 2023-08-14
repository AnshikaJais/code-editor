/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js}"];
export const theme = {
    extend: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1300px",
        },
    },
};
export const plugins = [];
