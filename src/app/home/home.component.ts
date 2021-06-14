import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  group = new FormGroup({
    price: new FormControl(''),
  });
  value:any;

  constructor(
    private db: AngularFireDatabase,
  ) { }

  async ngOnInit() {
    await this.getData();
  }
/*
onSubmit fonksiyonu:
  admin arayüzü üzerinden girilen park ücretindeki değişiklik, 
  veri  tabanında fiyat güncellemesi sağlar.
 */
  async onSubmit(frame:any) {
    await this.db.database.ref("admin").child("price").set({ TL: this.group.value["price"] });
    await this.getData();
    frame.show();
  }

  /*
⦁	getData fonksiyonu:
  Arayüz üzerindeki veri tabanında güncellenen otopark ücretlerinin
       görüntülenmesine olanak sağlar.
  
  */
  async getData() {
    this.value = await (await this.db.database.ref("admin").child("price").child("TL").get()).val();
    this.group.setValue({
      price: this.value,
    });
  }

}
