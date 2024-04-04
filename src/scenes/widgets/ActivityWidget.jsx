import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Button, Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import  Friend  from "components/Friend";
import  StarRating from "components/StarRating";

import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";



const PostWidget = ({

  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  averageRating
  
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes && likes[loggedInUserId]);
  const likeCount = likes ? Object.keys(likes).length : 0;
  const [participantsCount, setParticipantsCount] = useState(userPicturePath);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
//mich teb3ettek
  const patchLike = async () => {
    const response = await fetch(`http://127.0.0.1:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantsCount: participantsCount + 1 }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  

  const handleParticipate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/activity/updatePnb/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGQwMzg1ZTVlMWMwYjgzMmRkZTUxOSIsImlhdCI6MTcwODk4MzI2N30.NtY4W03iAEvVgSo9znvkdOxhTMNBlOSUbYm-Y1-O2x4`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to increment participants');
      }

    } catch (error) {
      console.error("Error participating:", error);

    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
 <Button onClick={handleParticipate}>Participate</Button>
      <Typography color={main} sx={{ mt: "1rem" }}>
Time: {description}
</Typography>
<Typography color={main} sx={{ mt: "1rem" }}>
rating: {averageRating}
</Typography>
<Typography color={main}>
Location: {location}
</Typography>
{picturePath && (
<Typography color={main}>
   Destination: {picturePath}
</Typography>
)}
{userPicturePath && (
<Typography color={main}>
  number Of Participants: {userPicturePath}
</Typography>
)}
{likes && (
<Typography color={main}>
  Starting Location: {likes}
</Typography>
)}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://127.0.0.1:3001/assets/${picturePath}`}
        />
      )}
          < StarRating  averageRating={averageRating} postId={postId} />
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
  
            <Typography>{likeCount}</Typography>
          </FlexBetween>
         
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {/* <Typography>{comments.length}</Typography> */}
          </FlexBetween>
        </FlexBetween>
     
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
         
          <Divider />
          
        </Box>
      )}
      
    </WidgetWrapper>
  );
};

export default PostWidget;
