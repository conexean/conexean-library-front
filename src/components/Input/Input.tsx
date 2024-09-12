import React, { InputHTMLAttributes, useState, useEffect } from "react";

export interface IInput extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id'> {
    name: string;
    id: string;
    label?: string;
    inputClass?: string;
    errors?: string;
    mask?: string;
}

const Input: React.FC<IInput> = ({ 
    name, 
    id, 
    value: propValue, 
    onChange, 
    inputClass, 
    label, 
    errors, 
    mask,
    ...rest 
}) => {
    const [inputValue, setInputValue] = useState(propValue || '');

    useEffect(() => {
        setInputValue(propValue || '');
    }, [propValue]);

    const applyMask = (value: string, mask: string) => {
        let maskedValue = '';
        let valueIndex = 0;

        for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
            if (mask[i] === '#') {
                maskedValue += value[valueIndex];
                valueIndex++;
            } else {
                maskedValue += mask[i];
                if (value[valueIndex] === mask[i]) {
                    valueIndex++;
                }
            }
        }

        return maskedValue;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, '');
        
        if (mask) {
            const maskedValue = applyMask(newValue, mask);
            setInputValue(maskedValue);
            
            if (onChange) {
                const syntheticEvent = {
                    ...e,
                    target: { ...e.target, name, value: maskedValue }
                };
                onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
            }
        } else {
            setInputValue(newValue);
            if (onChange) {
                onChange(e);
            }
        }
    };

    return (
        <div className="flex flex-col">
            {label && <label htmlFor={id} className={`mb-1 text-base ${errors ? 'text-red-500' : 'text-gray-700'}`}>{label}</label>}
            <input
                type="text"
                name={name}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                className={`block w-full px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring ${inputClass || ''}`}
                {...rest}
            />
            <span className="text-red-500 text-sm h-4 mt-1">{errors || '\u00A0'}</span>
        </div>
    );
};

export default Input;