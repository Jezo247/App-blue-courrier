package com.bluexml.alfresco.yamma;

import org.alfresco.service.namespace.QName;

/**
 * Define the Yamma Model.
 * 
 * TODO: This interface should be completed with the whole model being generated by SIDE.
 * 
 * @author pajot-b
 *
 */
public interface YammaModel {

	static final String YAMMA_MODEL_PREFIX = "yamma-ee";
	static final String YAMMA_MODEL_1_0_URI = "http://www.bluexml.com/model/content/yamma-ee/1.0";
	
    static final QName TYPE_DOCUMENT = QName.createQName(YAMMA_MODEL_1_0_URI, "Document");
    
    static final QName TYPE_DOCUMENT_CONTAINER = QName.createQName(YAMMA_MODEL_1_0_URI, "DocumentContainer");
    static final QName ASSOC_DOCUMENT_REFERENCE = QName.createQName(YAMMA_MODEL_1_0_URI, "DocumentContainer_reference_Document");
    
    static final QName ASPECT_STATUSABLE = QName.createQName(YAMMA_MODEL_1_0_URI, "Statusable");
    static final QName PROP_STATUSABLE_STATE = QName.createQName(YAMMA_MODEL_1_0_URI, "Statusable_state");

	static final QName TYPE_TRAY = QName.createQName(YAMMA_MODEL_1_0_URI, "Tray");
	
	static final QName TYPE_REPLY = QName.createQName(YAMMA_MODEL_1_0_URI, "Reply");
}
