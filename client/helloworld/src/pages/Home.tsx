import React from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import './Home.css';
import { BopmaticConfig } from "../bopmatic";

const PageHome: React.FC = () => {
  const pkgId : string = BopmaticConfig('PACKAGE_ID')
  const websiteUrl : string = BopmaticConfig('WEBSITE_ENDPOINT')
  const websiteAliasUrl : string = BopmaticConfig('WEBSITE_ALIAS_ENDPOINT')
  const sayHelloUrl : string = BopmaticConfig('GREETER_SAYHELLO_API_ENDPOINT')

  return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Home</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Home</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                This is example website content that you can include with your bopmatic deployment. It includes static content and show how to invoke the service APIs you've defined in your Bopmatic.yaml. The following Runtime Config section shows how to access various Bopmatic configuration values that are determined at runtime.
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Runtime Config</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>PACKAGE_ID</IonCol>
                    <IonCol>{pkgId}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>WEBSITE_ENDPOINT</IonCol>
                    <IonCol>{websiteUrl}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>WEBSITE_ALIAS_ENDPOINT</IonCol>
                    <IonCol>{websiteAliasUrl}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>GREETER_SAYHELLO_API_ENDPOINT</IonCol>
                    <IonCol>{sayHelloUrl}</IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonPage>
    );
};

export default PageHome;
