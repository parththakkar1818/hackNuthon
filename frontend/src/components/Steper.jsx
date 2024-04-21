import React, { useEffect, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import {
  SignedIn,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Steper: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { isHrInterviewDone } = location.state || {};
  const [messageApi, contextHolder] = message.useMessage();
  const handleDownload = async () => {
    const response = await axios.post("http://127.0.0.1:8000/fetchquestions");
    console.log(response);
  };

  const steps = [
    {
      title: "HR Interview",
      content: isHrInterviewDone ? (
        <Button onClick={handleDownload}>Downlad Data</Button>
      ) : (
        "Complete your Interview"
      ),
    },
    {
      title: "Technical Interview",
      content: "Start Your Technical Interview",
    },
  ];

  // const isHrInterviewDone = location.state.isHrInterviewDone || "";
  console.log("is done from here: ", isHrInterviewDone);
  useEffect(() => {
    if (isHrInterviewDone && current !== 1) {
      setCurrent(1);
    }
  }, [isHrInterviewDone]);

  const next = async () => {
    if (isSignedIn) {
      // Fetch questions from the backend
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/fetchquestions"
        );
        const questions = response.data.questions;
        console.log("Fetched questions:", questions);

        // Pass questions to HRInterview component
        setCurrent(current + 1);
        if (isHrInterviewDone) {
          // message("Your");
          message.info("Your Interview is already done..");
          setCurrent(1);
        } else {
          navigate("/hrinterview", { state: { questions } });
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        message.error("Failed to fetch questions. Please try again.");
      }
    } else {
      message.warning("Please sign in to proceed.");
    }
  };

  const prev = () => {
    // alert("I came into previous");
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default Steper;
