import { Col, Row, Image } from 'antd'
import React, { useActionState, useContext, useEffect, useState } from 'react'
import '../Css/ListSearch.css'
import { UserContext } from '../App'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const isURL = (input) => { // checking Incoming params is URL or not 
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(input.trim());
}

const ListSearch = () => {
    const handleSubmit = (params, formvalue) => {
        let value = formvalue.get("searching")
        setDynamicURL(value)
        return value
    }

    const { setDynamicURL, dynamicURL } = useContext(UserContext)
    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [searchingList, setSearchingList] = useState([])

    const navigate = useNavigate()
    const URL = `http://localhost:3002/scrap/search`

    // scrpping function
    const scrapping = (URL, formValue) => {
        setDynamicURL(formValue)
        try {
            if (pending || !formValue) return;
            if (isURL(formValue)) {
                dynamicScrapURL(formValue)
                return
            }
            axios.post(URL, { formData: formValue }).then((val) => {
                setSearchingList(val?.data)
            });

        } catch (err) {
            console.log(err);
        }
    }

    // gett scrapped Data 
    useEffect(() => {
        scrapping(URL, dynamicURL)
    }, [formValue])

    //this code navigate to seach page and scrap the current URL given by DB 
    const dynamicScrapURL = (scrappingURL) => {
        setDynamicURL(scrappingURL)
        navigate('/search')
    }

    return (
        <main className='searchListMain'>
            <Row className='inputSearchFieldSearch'>
                <Col span={24}>
                    <form action={submit}>
                        <input type="search" name="searching" id="searching" placeholder='Seach anything' />
                        <input type="submit" className='searchButton' value="submit" />
                    </form>
                </Col>
            </Row>
            <Row className='searchResultListMain'>
                <Col span={24}>
                    {searchingList?.length > 0 ? searchingList.map((value) => {
                        return <Row className='searchResultList'>
                            <Col span={24}>
                                <Row>
                                    <Col span={18}>
                                        <Row><a href={value.URLName} target='_blank'>{value.URLName}</a></Row>
                                        <Row onClick={() => dynamicScrapURL(value.URLName)}>
                                            <ul>
                                                {value.heading[0].map((value) => {
                                                    return <li>{value}</li>
                                                })}
                                            </ul>
                                        </Row>
                                    </Col>
                                    <Col span={6} className='imagesHead'>
                                        {value.images.map(img => {
                                            return <Row className='imagesRow'>
                                                <Image src={img} className='image' style={{ minHeight: '100px', maxHeight: '100px', minWidth: '100px', maxWidth: '100px' }} preview={false}></Image>
                                            </Row>
                                        })}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    }) : <Row className='notFoundImagesRow'>
                        <Col span={24} className='notFoundImageColum'>
                            <Row className='notFoundImageColumRowText'>We can't seem to find the page you are looking for.</Row>
                            <Row><Image src={'https://www.zoho.com/images/zoho-404-video.gif'} className='noResultImage' preview={false}></Image></Row>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </main>
    )
}

export default ListSearch

// timerResult.current = ((Date.now() - runningTimer.current) / 1000).toFixed(2) // this code follow the time Spend for every request by user.(it only store the datas in DB when the time duration is more than 5 secounds)