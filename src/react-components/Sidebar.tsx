import * as React	 from "react";

export function Sidebar() {
	return (
		<aside id="sidebar">
		<img id="company-logo" src="./Assets/company-logo.svg" alt="Construction Company" />
    <ul id="nav-buttons">
			<li id="project-btn"><span className="material-icons-round">apartment</span>Projects</li>
      <li id="user-btn"><span className="material-icons-round">people</span>User</li>
    </ul>
  </aside>
	)
}