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

import { Configuration, GreeterApi, HelloRequest, HelloReply } from "../openapi";

const PageSayHello: React.FC = () => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: 'some name',
    }
  });

  console.log(errors);
  console.log(getValues());

  const configuration = new Configuration();
  const greeterApi = new GreeterApi(configuration);

  /**
   *
   * @param data
   */
  const onSubmit = async (data: any) => {
    const req:HelloRequest = {
        name: data.name,
    };

    try {
        const respWrapper = await greeterApi.sayHello(req);
	const resp: HelloReply = respWrapper.data;
        alert('Server replied with: ' + resp.message)
    } catch(e) {
        alert('Failed to say hello: ' + e)
    }
  };

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Say Hello</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonCard>
              <IonCardHeader>
                <IonCardTitle>Say Hello</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem>
                  <IonLabel>Name:</IonLabel>
                  <IonInput
                  {...register('name', {
                      required: 'Your name',
                   })}
                  />
                 </IonItem>
                 <ErrorMessage
                   errors={errors}
                   name="name"
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

export default PageSayHello;
