import { OrderService } from './../services/order.service';
import { environment } from './../../environments/environment.prod';
import { PaymentService } from './../services/payment.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from '../services/user-profile.service';
import { UserProfileModel } from './../models/user-profile.model';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const Razorpay: any;

export interface PaymentDetails {
  amount: number;
}

@Component({
  selector: 'ngx-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private userProfile: UserProfileModel;
  private orderDetails: any;
  private options: any;
  private razorPay: any;
  private placedOrderReceipt: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PaymentDetails,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PaymentComponent> // private router: Router, // private route: ActivatedRoute,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.userProfileService.getProfile().subscribe((userProfile: UserProfileModel) => {
      if (userProfile) {
        this.userProfile = userProfile;

        this.options = {
          key: environment.razorpayKey, // Enter the Key ID generated from the Dashboard
          amount: '', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: 'INR',
          name: 'SPORTIZEN SPORTS SOLUTION LLP',
          description: 'For the love of Sports',
          image: '../../assets/icons/icon.png',
          // tslint:disable-next-line: max-line-length
          order_id: '', // This is a sample Order ID. Pass the `id` obtained in the response of Step 1 order_9A33XWu170gUtm
          handler: (response: any) => {
            this.verifyPayment(response);
          },
          modal: {
            ondismiss: () => {
              this.deleteOrder();
            },
          },
          prefill: {
            name: this.userProfile.name,
            email: this.userProfile.email,
            contact: this.userProfile.phoneNo,
          },
          notes: {
            address: '',
          },
          theme: {
            color: '#05bae3',
          },
        };

        this.razorPay = new Razorpay(this.options);

        this.orderDetails = {
          userId: this.userProfile.sportizenId,
          userPhone: this.userProfile.phoneNo,
          userName: this.userProfile.name,
          userEmail: this.userProfile.email,
          sportizenId: this.userProfile.sportizenId,
          description: 'Event Registration',
          amount: this.data.amount,
        };

        this.generateOrder();
      }
    });
  }

  private generateOrder() {
    this.orderService.generateOrder(this.orderDetails).subscribe(
      (res: any) => {
        this.placedOrderReceipt = res.paymentReceipt;
        // this.options.amount = res.order.amount;
        this.options.amount = '1';
        this.options.order_id = res.order.id;
        this.options.currency = res.order.currency;
        this.options.prefill.name = this.userProfile.name;
        this.options.prefill.email = this.userProfile.email;
        this.options.prefill.contact = this.userProfile.phoneNo;
        this.razorPay = new Razorpay(this.options);
        this.pay();
      },
      (err: any) => {
        this.showToastr(false, err);
        this.onClose(false);
      }
    );
  }

  private pay() {
    this.razorPay.open();
  }

  private deleteOrder() {
    this.orderService.deleteOrder(this.placedOrderReceipt._id).subscribe(
      (res: any) => {
        this.placedOrderReceipt = null;
        this.onClose(false);
      },
      (err: any) => {
        this.showToastr(false, err);
        this.onClose(false);
      }
    );
  }

  verifyPayment(payment: any) {
    this.paymentService.verifyPayment(payment, this.placedOrderReceipt).subscribe(
      (res: any) => {
        this.showToastr(true, 'Payment Verified Successfully');
        this.onClose(true, res.orderId, res.receiptId);
      },
      (err: any) => {
        this.showToastr(false, err);
        this.onClose(false);
      }
    );
  }

  onClose(status: boolean, orderId?: string, receiptId?: string) {
    this.dialogRef.close({ status, orderId, receiptId });
  }

  private showToastr(status: boolean, message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
      panelClass: [status ? 'success-snackbar' : 'error-snackbar'],
    });
  }

  ngOnDestroy() {}
}
