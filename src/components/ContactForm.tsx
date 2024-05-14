import React, { useState } from "react";

interface FormData {
  from: string;
  subject: string;
  html: string;
}

const ContactForm: React.FC<{
  endpoint: string;
}> = (props) => {
  const initialForm: FormData = {
    from: "",
    subject: "",
    html: "",
  };

  const [formData, setFormData] = useState<FormData>(initialForm);

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

    try {
      const send = await fetch(props.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              sendEmail(
                input: {
                  from: "${formData.from}",
                  subject: "${formData.subject}",
                  body: "${formData.html}",
                  clientMutationId: "${formData.subject}"}
              ) {
                sent
                message
              }
            }
          `,
        }),
      });

      const response = await send.json();
      const { message } = response.data.sendEmail;

      setSubmissionResult("success");
      console.log(`Form submitted successfully ${message}`);
    } catch (error) {
      setSubmissionResult("error");
      console.error("Error submitting form:", error);
    } finally {
      setFormData(initialForm);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-blue-300 shadow rounded-md p-4 w-full max-w-lg mx-auto">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                <div className="h-2 bg-gray-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="w-10/12 md:w-full max-w-lg" onSubmit={handleSubmit}>
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
              placeholder="you@email.com"
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
              placeholder="Subject"
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
              placeholder="Write something nice!"
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
    </>
  );
};

export default ContactForm;
