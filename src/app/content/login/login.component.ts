import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  user: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'bg-gradient-primary');
  }

  onSubmit(): void {
    if (this.authService.login(this.user)) {
      this.router.navigate(['..', 'admin'], { relativeTo: this.route });
    } else {
      this.user = {};
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'bg-gradient-primary');
  }
}
