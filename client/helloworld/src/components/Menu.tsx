import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { cartOutline, cartSharp, pricetagOutline, pricetagSharp, homeOutline, homeSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const homePage: AppPage[] = [
  {
    title: 'Home',
    url: '/page/Home',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  }
];

const rpcPages: AppPage[] = [
  {
    title: 'SayHello',
    url: '/page/SayHello',
    iosIcon: cartOutline,
    mdIcon: cartSharp
  },
];

const devPages: AppPage[] = [
  {
    title: 'SwaggerUI',
    url: '/page/SwaggerUI',
    iosIcon: '/assets/icon/swagger.svg',
    mdIcon: '/assets/icon/swagger.svg',
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="sayhello-list">
          <IonListHeader>Bopmatic Hello World Example </IonListHeader>
          <IonNote>github.com/bopmatic/examples/tree/main/client/helloworld</IonNote>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel> Home </IonLabel>
            </IonItemDivider>

            {homePage.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
	  </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel> Service RPCs </IonLabel>
            </IonItemDivider>

            {rpcPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
	  </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel> Developer Testing Tools </IonLabel>
            </IonItemDivider>

            {devPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
	  </IonItemGroup>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
