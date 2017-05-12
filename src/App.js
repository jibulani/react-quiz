import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";

class CategoryQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionsAmount: this.props.questions.length,
      currQuestion: this.props.questions.pop(),
      currAnswer: false,
      rightAnswers: 0,
      testEnded: false
    }
    this.getQuestion = this.getQuestion.bind(this);
    this.checkChoice = this.checkChoice.bind(this);
  }

  getQuestion() {
    if (this.props.questions.length > 0) {
      if (this.state.currAnswer) {
        this.setState((prevState, props) => ({
          rightAnswers: prevState.rightAnswers + 1,
          currQuestion: this.props.questions.pop()
        }));
      } else {
        this.setState({
        currQuestion: this.props.questions.pop()
        });
      }
    } else {
      if (this.state.currAnswer) {
        this.setState((prevState, props) => ({
          rightAnswers: prevState.rightAnswers + 1,
          testEnded: true
        }));
      } else {
        this.setState({
          testEnded: true
        });
      }
    }
    this.setState({
      currAnswer: false
    })
  }

  checkChoice(e) {
    console.log(e.target.value);
    if (e.target.value === this.state.currQuestion.answer) {
      this.setState({
        currAnswer: true
      });
    } else {
      this.setState({
        currAnswer: false
      })
    }
  }

  render() {
    if (!this.state.testEnded) {
      return (
        <div style={{marginTop: 10 + 'px'}}>
          <p>{this.state.currQuestion.questionText}</p>
          <form>{this.state.currQuestion.variants.map(
            variant => <p><input type="radio" name="variant" value={variant} onClick={this.checkChoice} />{variant}</p>
          )}</form>
          <button className="btn btn-primary" onClick={this.getQuestion}>
            Следующий вопрос
          </button>
        </div>
      )
    } else {
      return (
          <div style={{marginTop: 10 + 'px'}}>
            <p>Итоговая статистика</p>
            <p>Количество правильных ответов: {this.state.rightAnswers}</p>
            <p>Количество неправильных ответов: {this.state.questionsAmount - this.state.rightAnswers}</p>
          </div>
        )
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTest: false,
      isAddQuestion: false,
      questions: null,
      isCategorySelected: false,
      //currentCategory: null
    };
    this.startTestClick = this.startTestClick.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  componentDidMount() {
    const URL = 'https://quiz-app-1aa27.firebaseio.com/questions.json';
    fetch(URL).then(res => res.json()).then(json => {
      console.log(json);
      this.setState({ questions: json });
    });
  }

  startTestClick() {
    this.setState({
      isTest: true,
      isAddQuestion: false,
      isCategorySelected: false
    });
  }

  addQuestion() {
    this.setState({
      isTest: false,
      isAddQuestion: true,
      isCategorySelected: false
    });
  }

  selectCategory(e) {
    this.setState({
      isCategorySelected: true,
      currentCategory: e.target.name
    });
  }

  render() {
    const questions = [];
    let categories = [];
    if(!this.state.questions && !this.state.isCategorySelected) return <div>Loading...</div>;
    const questionsObj = this.state.questions;
    for (var key in questionsObj) {
      questions.push(questionsObj[key]);
    }
    for (let index = 0; index < questions.length; index++) {
        if (categories.indexOf(questions[index].category) < 0) {
          categories.push(questions[index].category);
        }
    }
    const isTest = this.state.isTest;
    const isAddQuestion = this.state.isAddQuestion;
    if (isTest && !this.state.isCategorySelected) {
      return (
        <div className="App">
          <h1>Quiz-app</h1>
          <button className="btn btn-primary" onClick={this.startTestClick} style={{marginRight: 5 + 'px'}}>
            Начать тестирование
          </button>
          <button className="btn btn-success" onClick={this.addQuestion}>
            Добавить вопрос
          </button>
          <div style={{marginTop: 10 + 'px'}}>{categories.map(category => <p><button className="btn btn-primary" onClick={this.selectCategory} key={category} name={category}>{category}</button></p>)}</div>
        </div>
      );
    } else if (isAddQuestion && !this.state.isCategorySelected) {
      return (
        <div className="App">
          <h1>Quiz-app</h1>
          <button className="btn btn-primary" onClick={this.startTestClick} style={{marginRight: 5 + 'px'}}>
            Начать тестирование
          </button>
          <button className="btn btn-success" onClick={this.addQuestion}>
            Добавить вопрос
          </button>
          <div>Adding question</div>
        </div>
      );
    } else if (this.state.isCategorySelected) {
      let categoryQuestions = []
      for (let index = 0; index < questions.length; index++) {
        if (questions[index].category === this.state.currentCategory) {
          categoryQuestions.push(questions[index]);
        }
      }
      return (
        <div className="App">
          <h1>Quiz-app</h1>
          <button className="btn btn-primary" onClick={this.startTestClick} style={{marginRight: 5 + 'px'}}>
            Начать тестирование
          </button>
          <button className="btn btn-success" onClick={this.addQuestion}>
            Добавить вопрос
          </button>
          <CategoryQuestions category={this.state.currentCategory}
            questions={categoryQuestions} />
        </div>
          
        )
    }else {
      return ( 
        <div className="App">
          <h1>Quiz-app</h1>
          <button className="btn btn-primary" onClick={this.startTestClick} style={{marginRight: 5 + 'px'}}>
            Начать тестирование
          </button>
          <button className="btn btn-success" onClick={this.addQuestion}>
            Добавить вопрос
          </button>
        </div>
      );
    }
    
  }
}

export default App;
