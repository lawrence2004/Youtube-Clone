import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    try {
      const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      if (!response.ok) {
        throw new Error("Failed to fetch video data");
      }
      const data = await response.json();
      setApiData(data.items[0]);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setError("Failed to fetch video data");
    }
  };

  const fetchChannelData = async () => {
    try {
      if (apiData) {
        const channelDetails_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        const response = await fetch(channelDetails_url);
        if (!response.ok) {
          throw new Error("Failed to fetch channel data");
        }
        const data = await response.json();
        setChannelData(data.items[0]);

        const commentDetails_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=30&videoId=${videoId}&key=${API_KEY}`;
        const commentResponse = await fetch(commentDetails_url);
        if (!commentResponse.ok) {
          throw new Error("Failed to fetch comments");
        }
        const commentData = await commentResponse.json();
        setCommentsData(commentData.items);
      }
    } catch (error) {
      console.error("Error fetching channel or comment data:", error);
      setError("Failed to fetch channel or comment data");
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [apiData]);

  return (
    <div className="play-video">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {/* <video src={video1} controls autoPlay muted></video> */}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          ></iframe>
          <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
          <div className="play-video-info">
            <p>
              {apiData ? value_converter(apiData.statistics.viewCount) : "16K"}{" "}
              &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
            </p>
            <div>
              <span>
                <img src={like} alt="" />
                {apiData ? value_converter(apiData.statistics.likeCount) : 155}
              </span>
              <span>
                <img src={dislike} alt="" /> 2
              </span>
              <span>
                <img src={share} alt="" />
                Share
              </span>
              <span>
                <img src={save} alt="" />
                Save
              </span>
            </div>
          </div>
          <hr />
          <div className="publisher">
            <img
              src={channelData ? channelData.snippet.thumbnails.default.url : ""}
              alt=""
            />
            <div>
              <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
              <span>
                {channelData
                  ? value_converter(channelData.statistics.subscriberCount)
                  : "1M"}{" "}
                Subscribers
              </span>
            </div>
            <button>Subscribe</button>
          </div>
          <div className="vid-description">
            <p>
              {apiData
                ? apiData.snippet.description.slice(0, 250)
                : "Description Here"}
            </p>
            <hr />
            <h4>
              {apiData ? value_converter(apiData.statistics.commentCount) : 155}
            </h4>
            {commentsData.map((item, index) => {
              return (
                <div key={index} className="comment">
                  <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                  <div>
                    <h3>
                      {item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span>
                    </h3>
                    <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                    <div className="comment-action">
                      <img src={like} alt="" />
                      <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                      <img src={dislike} alt="" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayVideo;
