import React, { useState } from "react";
import { stringToBase64 } from "uint8array-extras";
import classNames from "classnames";

interface FormData {
  to: string;
  from: string;
  subject: string;
  html: string;
}

const ContactForm: React.FC<{
  email: string;
  endpoint: string;
  mailgun_key: string;
}> = (props) => {
  const [formData, setFormData] = useState<FormData>({
    to: props.email,
    from: "",
    subject: "",
    html: "",
  });

  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<
    "success" | "error" | null
  >(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionResult(null);

    let body = new FormData();
    body.append("from", formData.from);
    body.append("to", formData.to);
    body.append("subject", formData.subject);
    body.append("html", formData.html);

    try {
      await fetch(props.endpoint, {
        method: "POST",
        headers: {
          Authorization: "Basic " + stringToBase64(`api:${props.mailgun_key}`),
        },
        body: body,
      });

      setSubmissionResult("success");
      console.log("Form submitted successfully");
    } catch (error) {
      setSubmissionResult("error");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={classNames("w-full max-w-lg", { "animate-pulse": loading })}
      onSubmit={handleSubmit}
    >
      {submissionResult === "success" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Message successfully sent.
        </div>
      )}
      {submissionResult === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          There was a problem sending this message.
        </div>
      )}

      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            htmlFor="from"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            From
          </label>
          <input
            id="from"
            name="from"
            type="email"
            className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            htmlFor="subject"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            htmlFor="html"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Message
          </label>
          <textarea
            id="html"
            name="html"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={formData.html}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <input
          type="submit"
          value="Submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default ContactForm;
