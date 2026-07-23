import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);


  const user = localStorage.getItem('user');


  if (!user) {

    router.navigate(['/']);

    return false;
  }


  const userData = JSON.parse(user);


  if (userData.roleName === 'Admin') {

    return true;

  }


  router.navigate(['/']);

  return false;

};