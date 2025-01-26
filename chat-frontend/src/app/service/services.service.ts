import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private baseUrl = "http://localhost:3000";
  public email = "";
  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  signup(user: { name: string, email: string, password: string, mobile: string, address: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  sendOtp(data: { email: string }): Observable<any> {
    this.email = data.email;
    return this.http.post(`${this.baseUrl}/sendotp`, data);
  }

  verifyUser(otp: string): Observable<any> {
    const data = {
      email: this.email,
      otp
    }
    return this.http.post(`${this.baseUrl}/verifyUser`, data);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTaskList(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/alltask`, { headers });
  }

  deleteTask(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/deletetask`, data, { headers });
  }

  getUserList(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/userlist`, { headers });
  }

  getUserListByLogin(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/userlistbylogin`, { headers });
  }

  addTask(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/createtask`, data, { headers });
  }

  updateTask(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/updatetask`, data, { headers });
  }
  
}
