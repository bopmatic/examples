import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonLabel,
  IonButton,
  IonContent,
  IonPage,
  IonItem,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { Configuration, MyOrderServiceApi, PlaceOrderRequest, PlaceOrderReply } from "../openapi";

const PagePlaceorder: React.FC = () => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customerId: '8053003192449',
      itemDesc: 'large iced coffee',
      itemCost: 3.99,
    }
  });

  console.log(errors);
  console.log(getValues());

  const configuration = new Configuration();
  const ordersApi = new MyOrderServiceApi(configuration);

  /**
   *
   * @param data
   */
  const onSubmit = async (data: any) => {
    const req:PlaceOrderRequest = {
        desc: {
                customerId: data.customerId,
                itemDescription: data.itemDesc,
                itemCost: data.itemCost
        }
    };

    try {
        const respWrapper = await ordersApi.placeOrder(req);
        const resp: PlaceOrderReply = respWrapper.data;
        var timestampInMillis = Number(resp.timestampInNanos) / 1000000
        var date = new Date(timestampInMillis);
        var dateStr = date.toLocaleDateString("default") + ' ' + date.toLocaleTimeString("default")
        alert('Successfully placed order id:' + resp.orderId + ' time:' + dateStr)
    } catch(e) {
        alert('Failed to place order: ' + e)
    }
  };

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Place Order</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonCard>
              <IonCardHeader>
                <IonCardTitle>Place Order</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem>
                  <IonLabel>Customer ID:</IonLabel>
                  <IonInput
                  {...register('customerId', {
                      required: 'Customer id is a required field',
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: 'Invalid customer id. Customer id should be a number.'
                      }
                   })}
                  />
                 </IonItem>
                 <ErrorMessage
                   errors={errors}
                   name="customerId"
                   as={<div style={{ color: 'red' }} />}
                 />

                <IonItem>
                  <IonLabel>Item Description:</IonLabel>
                  <IonInput
                  {...register('itemDesc', {
                      required: 'Item description',
                   })}
                  />
                 </IonItem>
                 <ErrorMessage
                   errors={errors}
                   name="itemDesc"
                   as={<div style={{ color: 'red' }} />}
                 />

                 <IonItem>
                  <IonLabel>Item Cost:</IonLabel>
                  <IonInput
                  {...register('itemCost', {
                      required: 'Item cost',
                      pattern: {
                        value: /^[0-9.]+$/i,
                        message: 'Invalid cost.'
                      }
                   })}
                  />
                 </IonItem>
                 <ErrorMessage
                   errors={errors}
                   name="itemCost"
                   as={<div style={{ color: 'red' }} />}
                 />
                <div>
                  <IonButton type="submit">submit</IonButton>
                </div>
              </form>
            </IonCardContent>
            </IonCard>
        </IonContent>
      </IonPage>
  );
};

export default PagePlaceorder;
