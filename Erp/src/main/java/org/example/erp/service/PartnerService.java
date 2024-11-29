package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Partner;
import org.example.erp.repository.PartnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class PartnerService {
    private final PartnerRepository partnerRepository;


    // 모든 파트너 조회
    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    // ID로 파트너 조회
    public Partner getPartnerById(Long id) {
        if(partnerRepository.findById(id).isPresent()) {
            return partnerRepository.findById(id).get();
        }
        return null;
    }

    // 파트너 등록
    public Partner createPartner(Partner partner) {
        return partnerRepository.save(partner);
    }

    // 파트너 정보 수정
    public Partner updatePartner(Long id, Partner updatedPartner) {
        Partner existingPartner = partnerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partner not found with ID: " + id));

        existingPartner.setName(updatedPartner.getName());
        existingPartner.setEmail(updatedPartner.getEmail());
        existingPartner.setManagerName(updatedPartner.getManagerName());
        existingPartner.setPhone(updatedPartner.getPhone());
        existingPartner.setAddress(updatedPartner.getAddress());
        existingPartner.setWebsite(updatedPartner.getWebsite());
        existingPartner.setDescription(updatedPartner.getDescription());
        existingPartner.setOutstanding(updatedPartner.getOutstanding());
        existingPartner.setContactStart(updatedPartner.getContactStart());
        existingPartner.setContactEnd(updatedPartner.getContactEnd());

        return partnerRepository.save(existingPartner);
    }

    // 파트너 삭제
    public void deletePartner(Long id) {
        partnerRepository.deleteById(id);
    }

}
