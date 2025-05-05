import axios from 'axios';
import '../Css/Search.css';
import React, { useActionState, useContext, useEffect, useInsertionEffect, useState } from 'react'
import { Flex, Row, Col, Typography, Input, Button, Divider } from 'antd'
import { SearchOutlined } from "@ant-design/icons";

const handleSubmit = (params, formvalue) => {
    return formvalue.get("searching")
}

const Search = () => {
    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [finalHTML, setFinalHtml] = useState([])

    useEffect(() => {
        if (pending || !formValue) return;
        try {
            let URL = `http://localhost:3002/scrap/search`;
            axios.post(URL, { formData: formValue }).then(val => setFinalHtml(val.data));
        } catch (err) {
            console.log(err);
        }
    }, [formValue])

    console.log(finalHTML);

    return (
        <div className='SearchModule'>
            <Row>
                <Col span={24}>
                    <Row className='inputSearchField'>
                        <Col span={24}>
                            <form action={submit}>
                                <input type="search" name="searching" id="searching" placeholder='Seach anything' />
                                <input type="submit" className='searchButton' value="submit" />
                            </form>
                        </Col>
                    </Row>

                    <Row className='searchResult'>
                        <Col span={24}>
                            {!Array.isArray(finalHTML) &&
                                <main>
                                    <Row style={{ padding: "10px 0" }}>
                                        <Typography.Link href={finalHTML?.name} target="_blank" copyable>{finalHTML?.name}</Typography.Link>
                                    </Row>

                                    <Row>
                                        <Col>
                                            {finalHTML?.data?.map((val) => {
                                                return val?.paragraphs?.length > 0 && <Row>
                                                    <Col span={24}>
                                                        <Row>
                                                            <Typography.Title level={4}><span style={{ color: '#4ca30d', fontWeight: '400' }}>{val.heading}</span></Typography.Title>
                                                        </Row>
                                                        {val?.paragraphs?.map((paraValue) => {
                                                            return <Row style={{ marginLeft: '10px' }}><Typography.Paragraph> <p style={{ fontWeight: '200' }}> {paraValue} </p></Typography.Paragraph></Row>
                                                        })}
                                                        <Divider style={{ borderColor: '#4ca30d' }} />
                                                    </Col>
                                                </Row>
                                            })}
                                        </Col>
                                    </Row>
                                </main>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default Search