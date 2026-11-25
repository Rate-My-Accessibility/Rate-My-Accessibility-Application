"use client";

import { Card, Image, Col } from "react-bootstrap";

type FeatureCardArgs = {
    name: string;
    accessScore: number | null;
    reviewCount: number;
    image: { file: string; altText: string } | null;
}

const FeatureCard = ({ name, accessScore, reviewCount, image }: FeatureCardArgs) => {
    return (
        <Col className="col-3 mb-3">
            <Card className="h-100">
                {image && <Card.Header style={{ height: "260px" }} className="d-flex justify-content-center align-items-center p-0"> 
                    <Image src={`/${image.file}`} alt={image.altText} style={{ borderRadius: "0.25rem 0.25rem 0 0" }} className="w-100 h-100 object-fit-cover" />
                </Card.Header>}
                <Card.Body>
                    <h5>{name}</h5>
                    <hr />
                    <p>
                        {reviewCount === 0 ? "No reviews" : `AccessScore: ${accessScore!.toFixed(1)} (${reviewCount})`}
                    </p>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default FeatureCard;