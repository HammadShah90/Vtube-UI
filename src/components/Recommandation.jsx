import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import axios from "axios";

const Container = styled.div`
  flex: 3;
`;

const Wrapper = styled.div``;

const Recommandation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideo();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommandation;
