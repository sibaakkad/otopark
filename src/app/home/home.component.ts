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

  async onSubmit(frame:any) {
    await this.db.database.ref("admin").child("price").set({ TL: this.group.value["price"] });
    await this.getData();
    frame.show();
  }
  async getData() {
    this.value = await (await this.db.database.ref("admin").child("price").child("TL").get()).val();
    this.group.setValue({
      price: this.value,
    });
  }

}
