import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

function Chatbot() {
  const navigate = useNavigate();

  // ✅ STATES (ALL INSIDE COMPONENT)
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "What problem are you facing?",
      sender: "bot",
      options: ["Buy Property", "Sell Property", "Contact"]
    }
  ]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [budget, setBudget] = useState(5000000);

  const chatEndRef = useRef(null);

  // ✅ AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ HANDLE OPTIONS
  const handleOptionClick = async (option) => {
    let newMessages = [{ text: option, sender: "user" }];

    // 🏠 BUY PROPERTY
    if (option === "Buy Property") {
      newMessages.push({
        text: "What do you want to buy?",
        sender: "bot",
        options: ["Plots", "Individual House", "Apartments"]
      });
    }

    // 🏷️ PROPERTY TYPE
    else if (
      option === "Plots" ||
      option === "Individual House" ||
      option === "Apartments"
    ) {
      setSelectedType(option);

      newMessages.push({
        text: "Select location",
        sender: "bot",
        options: ["Guntur", "Vijayawada"]
      });
    }

    // 📍 LOCATION
    else if (option === "Guntur" || option === "Vijayawada") {
      setSelectedLocation(option);

      newMessages.push({
        type: "budget-slider",
        sender: "bot"
      });
    }

    // 🏡 SELL PROPERTY
    else if (option === "Sell Property") {
      newMessages.push({
        text: "How would you like to proceed?",
        sender: "bot",
        options: [
          "Upload Property",
          "Edit Property",
          "View Your Listings",
          "Contact Support"
        ]
      });
    }

    // 📞 CONTACT
    else if (option === "Contact") {
      newMessages.push({
        text: "📞 +91-9876543210\n📧 support@rrconsultancy.com",
        sender: "bot"
      });
    }

    // 🔽 SELL OPTIONS
    else if (option === "Upload Property") {
      navigate("/upload-property");
      return;
    }

    else if (option === "Edit Property" || option === "View Your Listings") {
      navigate("/your-properties");
      return;
    }

    else if (option === "Contact Support") {
      newMessages.push({
        text: "📞 +91-9876543210\n📧 support@rrconsultancy.com",
        sender: "bot"
      });
    }

    // ✅ ADD "Anything else?"
    newMessages.push({
      text: "Anything else?",
      sender: "bot",
      options: ["Buy Property", "Sell Property", "Contact"]
    });

    setMessages((prev) => [...prev, ...newMessages]);
  };


  const parseMinPrice = (price) => {
  if (typeof price === "number") return price;

  if (!price) return 0;

  // "7,60,000 - 20,00,000" → "760000"
  const minPart = price.split("-")[0];
  const clean = minPart.replace(/[^\d]/g, ""); // remove commas, spaces, ₹, etc.
  return Number(clean) || 0;
};

const normalize = (v) => (v || "").toString().toLowerCase().trim();

  // ✅ APPLY BUDGET
  const handleBudgetApply = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/chatbot/properties?search=${selectedLocation}`
      );
      const data = await res.json();


      console.log("Selected:", { selectedType, selectedLocation, budget });
console.log("API data:", data);

     const filtered = data.filter((p) => {
  const price = parseMinPrice(p.price);
  data.forEach(p => {
  console.log({
    title: p.title,
    rawPrice: p.price,
    parsedPrice: parseMinPrice(p.price),
    type: p.type,
    location: p.location
  });
});





  const typeMatch =
    normalize(p.type) === normalize(selectedType) ||
    normalize(p.title).includes(normalize(selectedType)); // fallback

  const locationMatch =
    normalize(p.location).includes(normalize(selectedLocation));

  const priceMatch = price <= budget;

  return typeMatch && locationMatch && priceMatch;
});
      let newMessages = [];

      if (filtered.length > 0) {
        newMessages.push({
          type: "properties",
          data: filtered,
          sender: "bot"
        });
      } else {
        newMessages.push({
          text: "No properties found in this selection.",
          sender: "bot"
        });
      }

      newMessages.push({
        text: "Anything else?",
        sender: "bot",
        options: ["Buy Property", "Sell Property", "Contact"]
      });

      setMessages((prev) => [...prev, ...newMessages]);

      // RESET
      setSelectedLocation("");
      setSelectedType("");

    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching properties.", sender: "bot" }
      ]);
    }
  };

  const getMinPrice = (price) => {
  if (typeof price === "number") return price;

  if (price.includes("-")) {
    let min = price.split("-")[0]; // take first value
    min = min.replace(/,/g, "");   // remove commas
    return Number(min);
  }

  return Number(price.replace(/,/g, ""));
};

  // ❌ CLOSE RESET
  const handleClose = () => {
    setIsOpen(false);
    setMessages([
      {
        text: "What problem are you facing?",
        sender: "bot",
        options: ["Buy Property", "Sell Property", "Contact"]
      }
    ]);
  };

  return (
    <div className="chatbot-container">

      {/* Toggle */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div className="chatbot">

          {/* Header */}
          <div className="chat-header">
            <span>Chat with us</span>
            <button className="close-btn" onClick={handleClose}>❌</button>
          </div>

          {/* Body */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className="message-group">

                {/* 🔽 BUDGET SLIDER */}
                {msg.type === "budget-slider" ? (
                  <div className="slider-box">
                    <p>Budget: ₹ {budget.toLocaleString()}</p>

<input
  type="range"
  min="100000"
  max="100000000"  // ✅ up to 1 Crore
  step="50000"
  value={budget}
  onChange={(e) => setBudget(Number(e.target.value))}
/>
                    <button className="apply-btn" onClick={handleBudgetApply}>
                      Apply
                    </button>
                  </div>
                )

                // 🏠 PROPERTY CARDS
                : msg.type === "properties" ? (
                  <div className="property-list">
                    {msg.data.map((p) => (
                     <div
  key={p._id}
  className="property-card"
  onClick={() => {
    console.log("Clicked Property:", p);   // full object
    console.log("ID:", p._id);             // ID check
    navigate(`/property/${p._id}`);
  }}
>
                        <h4>{p.title}</h4>
                        <p>₹ {p.price}</p>
                        <p>📍 {p.location}</p>
                      </div>
                    ))}
                  </div>
                )

                // 💬 NORMAL TEXT
                : (
                  <div className={msg.sender}>{msg.text}</div>
                )}

                {/* OPTIONS */}
                {msg.options && (
                  <div className="options">
                    {msg.options.map((opt, i) => (
                      <button key={i} onClick={() => handleOptionClick(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}

            <div ref={chatEndRef}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
