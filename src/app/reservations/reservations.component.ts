import { User } from './../shared/services/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  public chartType: string = 'doughnut';

  public chartDatasets: Array<any> = [
    { data: [180, 180], label: 'Reservations' }
  ];

  public chartLabels: Array<any> = ['Giriş', 'çıkış', "Aktif"];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#fffda2', '#ff808b', '#a2ffa2'],
      hoverBackgroundColor: ['#fffda2', '#ff808b', '#a2ffa2'],
      borderWidth: 2,
    }
  ];
  profit:number= 0 ;
  commingProfit:number=0;
  values: Array<any> = [];
  users: number = 0;
  admins: number = 0;
  enteredCounter: number = 0;
  exitCounter: number = 0;
  activeCounter: number = 0;
  final: number = 0;

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(private db: AngularFireDatabase) { }

  async ngOnInit() {
    this.profit= 0 ;
    this.commingProfit=0;
    this.users =0;
    this.admins=0;
    this.values = [];
    this.enteredCounter = 0;
    this.exitCounter = 0;
    this.activeCounter = 0;

    let data = await this.db.database.ref("/rezervasyon").get();
    data.forEach(element => {
      if (element.val()["durum"] === "active") {
        this.activeCounter = this.activeCounter + 1;
      }
      else if (element.val()["durum"] === "girdi") {
        this.enteredCounter = this.enteredCounter + 1;
      } else {
        this.exitCounter = this.exitCounter + 1;
      }

      this.chartDatasets = [
        { data: [this.enteredCounter, this.exitCounter, this.activeCounter], label: 'Reservations' }
      ];

      this.values.push({
        code: element.val()["GeneratedCode"],
        parkNo: element.val()["parkNo"],
        ücret: element.val()["ücret"],
        durum: element.val()["durum"],
        enterDate: element.val()["enterDate"],
        enterTime: element.val()["enterTime"],
        rezDate: element.val()["rezDate"],
        place: element.val()["place"],
        rezTime: element.val()["rezTime"],
        exitTime: element.val()["exitTime"],
        exitDate: element.val()["exitDate"],
        odendi: element.val()["odendi"],
        key: element.key,

      });

      if(element.val()["odendi"]){
        this.profit = this.profit + Number(element.val()["ücret"]);
      }else{
        this.commingProfit = this.commingProfit + Number(element.val()["ücret"]);
      }
    });
    
    let records = await this.db.database.ref("/users").get();
    records.forEach((el1) => {
         
        if(el1.val()["role"] === "a"){
          this.admins = this.admins +1 ; 
        }else{
          this.users = this.users +1 ; 
        }
  });
  }
  async ode(value:string){
    await this.db.database.ref("rezervasyon").child(value).update({
      odendi:true
    }).then(()=>{
      this.ngOnInit();
    });
    
  }
}

