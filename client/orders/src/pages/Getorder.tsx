import React from 'react';
import {
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

import { Configuration, MyOrderServiceApi, GetOrderOperationRequest, GetOrderReply } from "../openapi";

const PageGetorder: React.FC = () => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      orderId: '0'
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
    const req:GetOrderOperationRequest = {
        body: {
            orderId: data.orderId,
         }
    };

    try {
        const resp: GetOrderReply = await ordersApi.getOrder(req);
	var timestampInMillis = Number(resp?.order?.timestampInNanos) / 1000000
	var date = new Date(timestampInMillis);
	var dateStr = date.toLocaleDateString("default") + ' ' + date.toLocaleTimeString("default")
        alert('Order details:\n  Customer ID:' + resp?.order?.desc?.customerId + '\n  Item Description:' + resp?.order?.desc?.itemDescription + '\n  Item Cost:' + resp?.order?.desc?.itemCost + '\n  Order time:' + dateStr)
    } catch(e) {
        alert('Failed to get order: ' + e)
    }
  };

  return (
      <IonPage>
        <IonContent fullscreen>
          <IonCard>
              <IonCardHeader>
                <IonCardTitle>Get Order</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem>
                  <IonLabel>Order ID:</IonLabel>
                  <IonInput
                  {...register('orderId', {
                      required: 'Order id is a required field',
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: 'Invalid order id. Order id should be a number.'
                      }
                   })}
                  />
                 </IonItem>
                 <ErrorMessage
                   errors={errors}
                   name="orderId"
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

export default PageGetorder;