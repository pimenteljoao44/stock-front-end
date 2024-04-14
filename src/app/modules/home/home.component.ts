import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { siginupUserRequest } from 'src/app/models/interfaces/user/SiginupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loginCard = true;

  loginForm = this.formbuilder.group({
    email:['',Validators.required],
    senha:['',Validators.required]
  })

  siginupForm = this.formbuilder.group({
    nome:['',Validators.required],
    email:['',Validators.required],
    senha:['',Validators.required]
  })

  constructor(
    private formbuilder:FormBuilder,
    private userService:UserService,
    private cookieService:CookieService,
    private messageService:MessageService,
    private router:Router
    ) { }

  ngOnInit() {
  }


  onsubmitLoginForm():void {
    if(this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next:(response) => {
          if(response) {
            this.cookieService.set('USER_INFO',response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard'])
            this.messageService.add({
              severity:'success',
              summary:'Sucesso',
              detail:`Bem Vindo devolta ${response.nome}`,
              life:2000
            })
          }
        },
        error:(err) => {
          this.messageService.add({
            severity:'error',
            summary:'Erro.',
            detail:'Erro ao fazer login',
            life:2000
          })
          console.log(err)
        },
      }) 
    }
  }

  onsubmitSignUpForm():void {
    if(this.siginupForm.value && this.siginupForm.valid) {
      this.userService.signupUser(this.siginupForm.value as siginupUserRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next:(response) => {
          if(response) {
            this.siginupForm.reset();
            this.loginCard = true;
            this.messageService.add({
              severity:'success',
              summary:'Sucesso',
              detail:'Usuario criado com sucesso!',
              life:2000
            })
          } 
        },
        error:(err) => {
          this.messageService.add({
            severity:'error',
            summary:'Erro.',
            detail:'Erro ao criar conta',
            life:2000
          })
          console.log(err)
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
