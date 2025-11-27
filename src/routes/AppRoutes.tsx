import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from '../pages/About';
import NavBar from '../components/NavBar/NavBar';
import { t } from 'i18next';
import Home from '../pages/Home';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
        <Route element={<NavBar />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div>{t("pageNotFound")}</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
