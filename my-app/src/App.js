import React from "react";
import { useState, useEffect } from "react";
// import "./App.css";

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-x-4">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-auto w-0 min-w-0 border border-gray-200 rounded-md p-2 text-sm"
        placeholder="Search"
      />
      <button
        type="submit"
        className="flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
      >
        Search
      </button>
    </form>
  );
}

function Messages({ searchTerm }) {
  const [messages, setMessages] = useState([]);
  // const [Loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchMessages = async (page) => {
      try {
        const response = await fetch(
          "https://italent2.demo.lithium.com/api/2.0/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              {
                messages: {
                  fields: ["author", "subject"],
                  constraints: [{ depth: 0 }, { "conversation.solved": false }],
                  limit: pageSize,
                  offset: page * pageSize,
                },
              },
              {
                categories: {
                  fields: ["title"],
                },
              },
            ]),
          }
        );
        const data = await response.json();
        const [allMessages] = data.data;
        setMessages(allMessages.items);
        window.scrollTo({ top: 0, behavior: "smooth" });
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // setLoading(false);
        // Handle errors as needed (e.g., show error message to user)
      }
    };

    fetchMessages(currentPage); // Call fetchMessages with currentPage
  }, [currentPage, pageSize]); // Depend on currentPage and pageSize changes
  // Pagination controls example

  const filteredMessages = messages.filter((message) =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  console.log("Messages:", messages);
  return (
    <>
      <ul className="divide-y divide-gray-100">
        {filteredMessages.map((message, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="subject text-sm font-semibold leading-6 text-gray-900">
                  {message.subject}
                </p>
                <p className="author mt-1 truncate text-xs leading-5 text-gray-500">
                  {message.author.login}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                Co-Founder / CEO
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="mr-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm "
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm "
        >
          Next
        </button>
      </div>
    </>
  );
}
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
    <>
      <div className="flex items-center justify-center margin-top p-6">
        <div className="container p-7 border border-solid">
          <Search onSearch={handleSearch} />
          <Messages searchTerm={searchTerm} />
        </div>
      </div>
    </>
  );
}

export default App;
