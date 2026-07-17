import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-4xl font-bold mb-6">About CampusThrift</h1>

        <p className="text-gray-700 leading-8 mb-8">
          CampusThrift is a student-to-student marketplace designed exclusively
          for Amity University students. Buy and sell books, electronics,
          stationery, clothes, sports equipment, tickets, and more within your
          campus community.
        </p>

        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">Version</h2>

            <p className="text-gray-600">CampusThrift v1.0</p>
          </div>

          <hr />

          <div>
            <h2 className="text-xl font-semibold">Privacy Policy</h2>

            <p className="text-gray-600">
              Your Amity email is used only for verification. Your password is
              securely encrypted and never stored in plain text. Contact
              information is only shown to users through your listings.
            </p>
          </div>

          <hr />

          <div>
            <h2 className="text-xl font-semibold">Terms & Conditions</h2>

            <p className="text-gray-600">
              CampusThrift is only for buying and selling legal items within
              Amity University. Users are responsible for their own
              transactions.
            </p>
          </div>

          <hr />

          <div>
            <h2 className="text-xl font-semibold">Contact Support</h2>

            <a
              href="mailto:support@campusthrift.in"
              className="text-blue-600 hover:underline"
            >
              support@campusthrift.in
            </a>
          </div>

          <hr />

          <div>
            <h2 className="text-xl font-semibold">Report a Bug</h2>

            <p className="text-gray-600">
              Found an issue? Please contact the developer or submit it through
              GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
