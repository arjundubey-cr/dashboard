import React from "react";
import "./styles.css";

interface UserInfoProps {
  name: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name }) => {
  return (
    <div className="userInfo">
      <img src="https://via.placeholder.com/150" alt="user" className="userImage" />
      <div>
        <div className="userName">{name}</div>
        <div className="userRole">Frontend Developer</div>
      </div>
    </div>
  );
};

export default UserInfo;
