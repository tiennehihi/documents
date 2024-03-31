// import { useState } from "react"
import "./style.css"

function UserProfile(props) {
  // const state = { active: true }  // Biến - variables
  // const [active, stateActive] = useState(true);
  // const changeActive = function() {
  //   // state.active = !state.active;
  //   // console.log(state.active);
  //   stateActive(!active);
  // }

  return (
    <div className="user-profile">
      <img className={`user-image ${props.active ? 'active' : ''} ${props.winner ? 'winner' : ''}`} src={props.image} alt="" />
      <i class={`fa-solid fa-crown icon-crown ${props.winner ? 'show' : ''}`}></i>
      <div>{props.name}</div>
    </div>
  );
}

export default UserProfile;