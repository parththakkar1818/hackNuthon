import React, { useState, useRef, useEffect } from "react";
import { Button, Flex } from "antd";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const VideoPage = () => {
  const videoRef = useRef(null);
  const [answer, setAnswer] = useState([]);
  const [start, setStart] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const questionVideos = useRef([]); // Use useRef for video elements to avoid re-renders
  const location = useLocation();
  const questions = location.state.questions;
  // console.log("from hr interview questions: ", questions);
  const navigate = useNavigate();
  const { user } = useUser();
  const userEmail = user.primaryEmailAddress["emailAddress"] || "";
  // console.log("here useremail: ",userEmail);
  const [isHrInterviewDone, setHrInterviewDone] = useState(1);
  var slicedAnswer="";
  var slicedLabel="";
  

  // Load videos on component mount or update (if new videos are added dynamically)
  useEffect(() => {
    const context = require.context("./questionVideos", false, /\.(mp4)$/);
    questionVideos.current = context.keys().map(context);
  }, []);

  const handleNextQuestion = () => {
    setStart(0);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % 6);
    videoRef.current.load(); // Reload video to avoid potential playback issues
    videoRef.current.play();
    setAnswer([
      ...answer,
      "Interviewer: " + questions[currentQuestionIndex + 3],
    ]);
    // console.log(answer);
  };

  const handleClick1 = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/activate_function"
      );
      // console.log(response);
      // console.log(response.data["yourans"]); // Log the response from FastAPI
      setAnswer([...answer, "Candidate: " + response.data["yourans"]]);
      // console.log(answer);
    } catch (error) {
      console.error(error); // Log any errors
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDone = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadconversations",
        { userEmail: userEmail, conversation: answer }
      );
      setHrInterviewDone(1);

      navigate("/", { state: { isHrInterviewDone } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-5 font-black bg-gradient-to-r from-blue-700 to-cyan-400 bg-clip-text text-transparent text-4xl flex text-black-600  flex-auto justify-center ">
        Interview With A.I. model
      </div>
      <div className="flex flex-row max-w-full max-h-full">
        <div className="rounded-lg flex mt-5 w-[55rem] h-[37rem] justify-center items-center shadow-2xl bg-gray-50">
          <video ref={videoRef} className="object-contain rounded-lg h-[95%]">
            <source
              src={questionVideos.current[currentQuestionIndex]}
              type="video/mp4"
            />
          </video>
        </div>
        <div className="flex rounded-lg mt-5 w-[30rem] h-[37rem] justify-center items-center shadow-inner bg-gray-50">
          <div className="rounded-lg w-full h-[37rem] shadow-inner bg-gray-50">
            <div className=" overflow-y-auto max-h-full scroll-container mr-5">
              {answer.map((ans, index) => (
                <div key={index} className="ml-5 mr-5 flex flex-row">
                  {ans[0] == "I" && (
                    <h1 className=" text-[18px] bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                      {ans}
                    </h1>
                  )}
                  {ans[0] == "C" && (
                    <h1 className=" text-[18px] bg-gradient-to-r from-orange-500 via-yellow-600 to-orange-500 bg-clip-text text-transparent">
                      {ans}
                    </h1>
                  )}
                </div>
              ))}
            </div>
            {isGenerating && (
              <h1 className="ml-5 font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Listening...
              </h1>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-auto items-center justify-center mt-3">
        <Button
          type="primary"
          className="font-satoshi text-black-600 font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-xl ml-[190px] mr-[10px] pb-8  w-[12%]"
          onClick={handleNextQuestion}
        >
          {start ? "Start Interview" : "Next Question"}
        </Button>
        <Button
          type="primary"
          onClick={handleClick1}
          className="font-satoshi font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-black-600 text-xl pb-8  w-[12%]"
        >
          Give Answer
        </Button>
        <Button
          type="primary"
          onClick={handleDone}
          className="font-satoshi font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-black-600 text-xl  ml-2 pb-8  w-[12%]"
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default VideoPage;
