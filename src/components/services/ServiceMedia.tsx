import { HAIRLINE } from "@/components/services/service-tokens";

/*
 * מדיה אמיתית מהקליניקה של ענבר לעמודי הטיפול.
 * שפת דף הבית: מסגרת hairline, בלי עיגול פינות ובלי צל.
 */

const caption: React.CSSProperties = {
  fontWeight: 300,
  fontSize: "13px",
  lineHeight: 1.8,
  color: "#6B6B6B",
  textAlign: "center",
  marginTop: "12px",
};

/* עמוד היבלות: הוצאת יבלת מכרית כף הרגל. סרטון שקט בלופ. */
export function CornRemovalVideo() {
  return (
    <figure style={{ margin: "40px auto", maxWidth: "340px" }}>
      <video
        src="/media/inbar-corn-removal.mp4"
        poster="/media/inbar-corn-removal-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="הוצאה ידנית של יבלת מכרית כף הרגל בקליניקה של ענבר פרחי"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "9 / 16",
          objectFit: "cover",
          border: `1px solid ${HAIRLINE}`,
          background: "#EFEDE8",
        }}
      />
      <figcaption style={caption}>הוצאה ידנית של יבלת מכרית כף הרגל, מהקליניקה של ענבר</figcaption>
    </figure>
  );
}

/* עמוד סדקים בעקבים: לפני ואחרי טיפול בעור יבש ומעובה. */
export function CrackedHeelsBeforeAfter() {
  return (
    <figure style={{ margin: "40px 0" }}>
      <img
        src="/media/cracked-heels-before-after.webp"
        width={1200}
        height={390}
        loading="lazy"
        decoding="async"
        alt="לפני ואחרי: בצד ימין עקב עם עור עבה, יבש ומתקלף, ובצד שמאל אותו עקב אחרי הטיפול עם עור חלק"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          border: `1px solid ${HAIRLINE}`,
        }}
      />
      <figcaption style={caption}>
        לפני ואחרי טיפול בעור יבש ומעובה בעקב, מהקליניקה של ענבר
      </figcaption>
    </figure>
  );
}
