import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GithubProfileViewer';
  myForm = new FormGroup({
    username: new FormControl('')
  });
  userFound = false;
  isLoading = false;
  userNotFound = false;
  data: any;
  name: any;
  avatarUrl: any;
  location: any;
  htmlUrl: any;
  constructor(private http: HttpClient, private SnackBar: MatSnackBar) { }


  findUser() {
    if (!this.myForm.value.username) {
      this.openSnackBar('Username field is empty', '');
      return;
    }

    if (localStorage.getItem(this.myForm.value.username)) {
      this.data = JSON.parse(localStorage.getItem(this.myForm.value.username));
      this.display(this.data);
      this.isLoading = false;
      this.userFound = true;
    } else {
      this.isLoading = true;
      // tslint:disable-next-line:max-line-length
      this.http.get('https://api.github.com/users/' + this.myForm.value.username + '?access_token=fa9a355f2ec9730f1640df267baae3d283909c6d').subscribe(response => {
        console.log(response);
        this.data = response;
        this.display(this.data);
        this.isLoading = false;
        this.userFound = true;
        this.userNotFound = false;
        localStorage.setItem(this.myForm.value.username, JSON.stringify(response));
      }, error => {
        this.isLoading = false;
        this.userFound = false;
        this.userNotFound = true;
        this.openSnackBar('No Results Found', '');
      });
    }
  }

  display(data) {
    this.name = this.data.name;
    this.avatarUrl = this.data.avatar_url;
    this.location = this.data.location;
    this.htmlUrl = this.data.html_url;
  }

  openSnackBar(message: string, action: string) {
    this.isLoading = false;
    this.userFound = false;
    this.SnackBar.open(message, action, {
      duration: 2000,
    });
  }
}
