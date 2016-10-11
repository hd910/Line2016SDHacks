import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <nav class="mainColorDark" role="navigation" style="border-bottom: 3px solid #2980b9;">
        <div class="nav-wrapper container">
          <a id="logo-container" href="#" class="brand-logo">
            <img src="img/logo.png" alt="" height="35px" style="position:relative;top:5px"/>
            Queue
            </a>
          <ul class="right hide-on-med-and-down">
            <li><a href="#new">What's New</a></li>
            <li><a href="#location">Location</a></li>
            <li><a href="#trend">Queue Trends</a></li>
          </ul>

          <ul id="nav-mobile" class="side-nav">
            <li><a href="#new">What's New</a></li>
            <li><a href="#location">Location</a></li>
            <li><a href="#trend">Queue Trends</a></li>
          </ul>
          <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
        </div>
      </nav>
    );
  }
}
