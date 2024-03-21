import React, { useState } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Select from "react-select";
import MediaQuery from "react-responsive";

const options = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
];

const AddSegment = () => {
    const [isPaneOpen, setIsPaneOpen] = useState(false);
    const [segmentName, setSegmentName] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedSchemas, setSelectedSchemas] = useState([]);
    const [availableOptions, setAvailableOptions] = useState(options);

    const handleSaveSegment = () => {
        setIsPaneOpen(true);
    };

    const handlePaneClose = () => {
        setIsPaneOpen(false);
        setSegmentName("");
        setSelectedOption(null);
    };

    const handleSaveSegmentData = () => {
        const segmentData = {
            segment_name: segmentName,
            schema: selectedSchemas,
        };

        // Log the formatted segment data to the console
        console.log(JSON.stringify(segmentData, null, 2));

        // Send segment data to server
        fetch('https://webhook.site/your-webhook-url', { // Replace 'your-webhook-url' with the actual webhook URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(segmentData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send segment data to server');
                }
                return response.json();
            })
            .then(data => {
                console.log('Segment data sent successfully:', data);
                // Reset state and close the pane
                setAvailableOptions(options);
                handlePaneClose();
            })
            .catch(error => {
                console.error('Error sending segment data:', error);
                // Handle error here
            });
    };






    const handleAddSchema = () => {
        if (selectedOption) {
            setSelectedSchemas((prevSchemas) => [
                ...prevSchemas,
                { [selectedOption.value]: selectedOption.label },
            ]);

            setAvailableOptions((prevOptions) =>
                prevOptions.filter((option) => option.value !== selectedOption.value)
            );

            setSelectedOption(null);
        }
    };

    const handleRemoveSchema = (schema) => {
        setSelectedSchemas((prevSchemas) =>
            prevSchemas.filter((s) => s !== schema)
        );

        setAvailableOptions((prevOptions) => [
            ...prevOptions,
            { label: schema[Object.keys(schema)[0]], value: Object.keys(schema)[0] },
        ]);
    };

    const handleChangeSchema = (schema, newOption) => {
        setSelectedSchemas((prevSchemas) =>
            prevSchemas.map((s) =>
                s === schema ? { [newOption.value]: newOption.label } : s
            )
        );

        setAvailableOptions((prevOptions) =>
            prevOptions.filter((option) => option.value !== newOption.value)
        );
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <button className="btn btn-primary " onClick={handleSaveSegment}>
                Save segment
            </button>
            <MediaQuery minWidth={768}>
                <SlidingPane
                    isOpen={isPaneOpen}
                    title="Saving the Segment"
                    onRequestClose={handlePaneClose}
                    width="40%" // Set the desired width here, like "300px" or "50%"
                >
                    <div>
                        <label>Enter the name of the Segment</label>
                        <br />
                        <input
                            type="text"
                            value={segmentName}
                            onChange={(e) => setSegmentName(e.target.value)}
                            className="form-control mt-2"
                            placeholder="Name of the segment"
                        />
                    </div>
                    <p className="mt-2">To save your segment, you need to add the schemas to build the query.</p>

                    <div className="border border-primary p-3 mt-4">
                        {selectedSchemas.map((schema, index) => (
                            <div key={index} className="selected-schema p-2 d-flex justify-content-between">
                                <Select
                                    value={options.find((option) => option.value === Object.keys(schema)[0])}
                                    options={availableOptions}
                                    className="col-md-10"
                                    onChange={(newOption) => handleChangeSchema(schema, newOption)}
                                />
                                <p className=" bg-light fs-5 fw-bold px-2 py-0 float-end"><i class='bx bx-minus' onClick={() => handleRemoveSchema(schema)}></i></p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <label>Add schema to segment:</label>
                        <Select
                            value={selectedOption}
                            options={availableOptions}
                            onChange={(option) => setSelectedOption(option)}
                            className="mt-2"
                        />
                        <a className="text-success mt-3" onClick={handleAddSchema}>
                            + Add new schema
                        </a>
                    </div>
                    <div className="fixed-bottom bg-light p-3">
                        <button className="btn btn-primary mt-2" onClick={handleSaveSegmentData}>
                            Save Segment
                        </button>
                        <button className="btn border-light text-danger   mt-2" onClick={handlePaneClose}>
                            Cancel
                        </button>
                    </div>
                </SlidingPane>
            </MediaQuery>
        </div>
    );
};

export default AddSegment;