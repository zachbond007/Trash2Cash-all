import "./ImportCoupon.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Offer } from "../../api/types";
import { getOnlineOffers, submitImportCoupon } from "../../api/onlineVoucher";
import { getConfigByKey } from "../../api/configApi";
import { useNotify } from "react-admin";

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
};

const ImportCoupon = () => {
  const notify = useNotify();
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const prepareData = async () => {
      const res = await getOnlineOffers();
      const data = JSON.parse(res);
      if (data.offers !== null) {
        const currentDate = new Date();
        const filteredOffers: Offer[] = data.offers
          .filter(
            (offer: any) =>
              new Date(offer.start_date) <= currentDate &&
              currentDate <= new Date(offer.end_date)
          )
          .map((offer: any) => ({
            lmd_id: offer.lmd_id,
            categories: offer.categories,
            offer_text: offer.offer_text,
            offer_value: offer.offer_value,
            title: offer.title,
            store: offer.store,
            smartLink: offer.smartLink,
            start_date: new Date(offer.start_date),
            end_date: new Date(offer.end_date),
            selected: false,
            code: offer.code,
            url: offer.url,
            description: offer.description,
            selected_categories: [],
            level: 2,
          }));
        setOffers(filteredOffers);
      } else {
        alert("No new offers found.");
      }
    };
    prepareData();
  }, []);

  const handleCheckboxChange = (lmd_id: string) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.lmd_id === lmd_id
          ? { ...offer, selected: !offer.selected }
          : offer
      )
    );
  };

  const onCategoryClick = (item: string, offer: Offer) => {
    if (!offer.selected) {
      setOffers((prevOffers) =>
        prevOffers.map((val) =>
          val.lmd_id === offer.lmd_id
            ? {
                ...val,
                selected: true,
                selected_categories: [...val.selected_categories, item],
              }
            : val
        )
      );
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((val) =>
          val.lmd_id === offer.lmd_id
            ? {
                ...val,
                selected_categories: val.selected_categories.includes(item)
                  ? val.selected_categories.filter(
                      (category) => category !== item
                    )
                  : [...val.selected_categories, item],
              }
            : val
        )
      );
    }
  };

  const onLevelClick = (item: number, offer: Offer) => {
    setOffers((prevOffers) =>
      prevOffers.map((val) =>
        val.lmd_id === offer.lmd_id
          ? {
              ...val,
              level: item,
            }
          : val
      )
    );
  };

  const onSubmit = async () => {
    const body = offers.filter((x) => x.selected);
    if (body.length > 0) {
      const res = await submitImportCoupon(body);
      if (res) {
        notify("Submitted successfully.");
        setOffers([]);
      }
    }
  };

  return (
    <div className="main-container">
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header-box">
              <tr>
                <th>#</th>
                <th></th>
                <th>Store</th>
                <th>Title</th>
                <th>Offer Value</th>
                <th>Offer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>URL</th>
                <th>Smart Link</th>
                <th>Level</th>
                <th>Categories</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => {
                const {
                  lmd_id,
                  title,
                  store,
                  smartLink,
                  offer_text,
                  offer_value,
                  selected,
                  start_date,
                  end_date,
                  categories,
                  level,
                  selected_categories,
                  url,
                } = offer;
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleCheckboxChange(lmd_id)}
                        style={{ height: 20, width: 20, cursor: "pointer" }}
                      />
                    </td>
                    <td>{store}</td>
                    <td>{title}</td>
                    <td>{offer_value}</td>
                    <td>{offer_text}</td>
                    <td>{formatDate(start_date)}</td>
                    <td>{formatDate(end_date)}</td>
                    <td>
                      <a href={url}>URL</a>
                    </td>
                    <td>
                      <a href={smartLink}>Smart Link</a>
                    </td>
                    <td width={160}>
                      {[2, 3, 4, 5, 6, 7, 8].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onLevelClick(item, offer)}
                          className={`level-button ${
                            level === item && "selected"
                          }`}>
                          {item}
                        </div>
                      ))}
                    </td>
                    <td>
                      {categories.split(",").map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onCategoryClick(item, offer)}
                          className={`category-button ${
                            selected_categories.includes(item) && "selected"
                          }`}>
                          {item}
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="submit-button-container" onClick={onSubmit}>
        <p className="submit-button-title">Submit</p>
      </div>
    </div>
  );
};

export default ImportCoupon;
