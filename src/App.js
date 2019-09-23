import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";

class App extends Component {
  state = {
    currentAuthor: null,
    authors: [],
    filteredAuthors: [],
    loading: true
  };

  selectAuthor = async author => {
    this.setState({ loading: true });
    let url =
      "https://the-index-api.herokuapp.com/api/authors/" + author.id + "/";
    try {
      var response = await axios.get(url);
      const newAuthor = response.data;
      this.setState({
        currentAuthor: newAuthor,
        loading: false
      });
    } catch (error) {
      console.error("SOMETHING WENT HORRIBLY WRONG");
      console.error(error);
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else if (this.state.loading) {
      return (
        <>
          <h1>Loading</h1>
        </>
      );
    } else {
      return (
        <AuthorsList
          authors={this.state.filteredAuthors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };

  async componentDidMount() {
    try {
      var response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      const newAuthors = response.data;
      this.setState({
        authors: newAuthors,
        filteredAuthors: newAuthors,
        loading: false
      });
    } catch (error) {
      console.error("SOMETHING WENT HORRIBLY WRONG");
      console.error(error);
    }
  }

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
